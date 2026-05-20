import { useAdmin } from "@/contexts/AdminContext";
import { Link, useLocation } from "wouter";
import { ShieldCheck, LogOut, Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { isAuthenticated, logout } = useAdmin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  if (!isAuthenticated) {
    setLocation("/admin");
    return null;
  }

  const handleSave = () => {
    toast({ title: "Settings saved successfully" });
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/40 pb-2">
              <Settings className="w-5 h-5 text-muted-foreground" />
              General Operations
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Maintenance Mode</h4>
                <p className="text-sm text-muted-foreground">Disable public access to the platform</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto-approve Verified Devs</h4>
                <p className="text-sm text-muted-foreground">Skip moderation queue for trusted creators</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/40 pb-2">
              Social Links
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp Support Group</label>
                <Input defaultValue="https://chat.whatsapp.com/..." className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Telegram Channel</label>
                <Input defaultValue="https://t.me/vantagearmy" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Main YouTube Channel</label>
                <Input defaultValue="https://youtube.com/c/VantageArmy" className="bg-background/50" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/40 pb-2">
              App Information
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current APK Version</label>
                <Input defaultValue="1.0.0" className="bg-background/50 w-32" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Direct APK Download Link (PWA alternative)</label>
                <Input defaultValue="https://example.com/vantage-minehub.apk" className="bg-background/50" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
