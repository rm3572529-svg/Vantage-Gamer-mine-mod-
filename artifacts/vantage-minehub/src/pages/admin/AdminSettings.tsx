import { useAdmin } from "@/contexts/AdminContext";
import { Link, useLocation } from "wouter";
import { ShieldCheck, LogOut, Settings, Save, Loader2, Globe, MessageCircle, Youtube, Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

type PlatformSettings = {
  whatsapp: string;
  telegram: string;
  discord: string;
  instagram: string;
  youtube1: string;
  youtube2: string;
  maintenance: string;
  version: string;
  apk_link: string;
  announcement_banner: string;
};

const DEFAULT: PlatformSettings = {
  whatsapp: "",
  telegram: "",
  discord: "",
  instagram: "",
  youtube1: "",
  youtube2: "",
  maintenance: "false",
  version: "1.0.0",
  apk_link: "",
  announcement_banner: "",
};

export default function AdminSettings() {
  const { isAuthenticated, logout } = useAdmin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!isAuthenticated) {
    setLocation("/admin");
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      toast({ title: "Settings saved — changes are live on all devices." });
    } catch {
      toast({ title: "Failed to save settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof PlatformSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSettings((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-red-500 font-bold hover:text-red-400">
              <ShieldCheck className="h-6 w-6" />
              Vantage Admin
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">Settings</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Changes saved here update instantly on all devices worldwide.</p>
          </div>
          <Button onClick={handleSave} disabled={saving || loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>

        {/* General */}
        <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/40 pb-3">
            <Settings className="w-5 h-5 text-muted-foreground" />
            General Operations
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Maintenance Mode</h4>
              <p className="text-sm text-muted-foreground">Shows a maintenance message to all visitors</p>
            </div>
            <Switch
              checked={settings.maintenance === "true"}
              onCheckedChange={(v) => setSettings((prev) => ({ ...prev, maintenance: String(v) }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Homepage Announcement Banner</label>
            <Input
              value={settings.announcement_banner}
              onChange={set("announcement_banner")}
              placeholder="e.g. New update v2.0 is now available! Download now."
              className="bg-background/50"
            />
            <p className="text-xs text-muted-foreground">Shows as a top banner on homepage for all users. Leave empty to hide.</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/40 pb-3">
            <Globe className="w-5 h-5 text-muted-foreground" />
            Social Links
            <span className="ml-auto text-xs font-normal text-green-500 bg-green-500/10 px-2 py-1 rounded-full">Live on all devices</span>
          </h3>
          {[
            { key: "whatsapp" as const, label: "WhatsApp Group Link (Primary)", icon: MessageCircle, placeholder: "https://chat.whatsapp.com/..." },
            { key: "telegram" as const, label: "Telegram Channel", icon: Send, placeholder: "https://t.me/..." },
            { key: "discord" as const, label: "Discord Server", icon: Globe, placeholder: "https://discord.gg/..." },
            { key: "instagram" as const, label: "Instagram Profile", icon: Instagram, placeholder: "https://instagram.com/..." },
            { key: "youtube1" as const, label: "YouTube Channel 1", icon: Youtube, placeholder: "https://youtube.com/c/..." },
            { key: "youtube2" as const, label: "YouTube Channel 2", icon: Youtube, placeholder: "https://youtube.com/c/..." },
          ].map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </label>
              <Input value={settings[key]} onChange={set(key)} placeholder={placeholder} className="bg-background/50" />
            </div>
          ))}
        </div>

        {/* App Info */}
        <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/40 pb-3">
            App Information
          </h3>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Current Platform Version</label>
            <Input value={settings.version} onChange={set("version")} className="bg-background/50 w-32" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">APK Download Link (Install App)</label>
            <Input value={settings.apk_link} onChange={set("apk_link")} placeholder="https://..." className="bg-background/50" />
            <p className="text-xs text-muted-foreground">This link appears on the Install App button visible to all users.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
