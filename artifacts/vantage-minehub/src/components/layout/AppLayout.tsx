import { ReactNode, useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { MessageCircle, Send, Youtube, Instagram, X } from "lucide-react";

type SiteSettings = {
  whatsapp?: string;
  telegram?: string;
  discord?: string;
  instagram?: string;
  youtube1?: string;
  youtube2?: string;
  maintenance?: string;
  announcement_banner?: string;
};

let cachedSettings: SiteSettings | null = null;

export function AppLayout({ children, title, description }: { children: ReactNode; title?: string; description?: string }) {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings ?? {});
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    if (title) document.title = `${title} — Vantage Gamer MineHub`;
    else document.title = "Vantage Gamer MineHub — Minecraft Mods & Tools";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description ?? "The definitive Minecraft modding hub for the Vantage Army. Download safe, curated mods, tools, textures, and shaders.");
  }, [title, description]);

  useEffect(() => {
    if (cachedSettings) return;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        cachedSettings = data;
        setSettings(data);
      })
      .catch(() => {});
  }, []);

  const whatsappLink = settings.whatsapp || "https://wa.me/message/VANTAGE";
  const banner = settings.announcement_banner;
  const isMaintenance = settings.maintenance === "true";

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl font-black text-yellow-500">!</span>
          </div>
          <h1 className="text-3xl font-bold">Under Maintenance</h1>
          <p className="text-muted-foreground">Vantage MineHub is currently undergoing maintenance. We will be back shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative">
      <Navbar />

      {/* Announcement Banner */}
      {banner && !bannerDismissed && (
        <div className="w-full bg-primary/10 border-b border-primary/20 px-4 py-2.5 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-primary flex-1 text-center">{banner}</p>
          <button onClick={() => setBannerDismissed(true)} className="text-muted-foreground hover:text-foreground shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-auto bg-card/30">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Vantage MineHub</h3>
              <p className="text-sm text-muted-foreground">The official platform for the Vantage Army community. Download safe, curated Minecraft mods, tools, textures, and shaders.</p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Platform</h3>
              <div className="flex flex-col gap-2 text-sm">
                <a href="/mods" className="hover:text-primary transition-colors">Browse Mods</a>
                <a href="/developers" className="hover:text-primary transition-colors">Creators</a>
                <a href="/announcements" className="hover:text-primary transition-colors">Announcements</a>
                <a href="/become-developer" className="hover:text-primary transition-colors">Become a Developer</a>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Community</h3>
              <div className="flex flex-col gap-2 text-sm">
                {whatsappLink && <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-green-500 transition-colors"><MessageCircle className="h-4 w-4" /> WhatsApp (Main)</a>}
                {settings.telegram && <a href={settings.telegram} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-400 transition-colors"><Send className="h-4 w-4" /> Telegram</a>}
                {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-pink-500 transition-colors"><Instagram className="h-4 w-4" /> Instagram</a>}
                {settings.youtube1 && <a href={settings.youtube1} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-500 transition-colors"><Youtube className="h-4 w-4" /> YouTube</a>}
                {settings.youtube2 && <a href={settings.youtube2} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-500 transition-colors"><Youtube className="h-4 w-4" /> YouTube 2</a>}
              </div>
            </div>
          </div>
          <div className="border-t border-border/40 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Vantage Army. All rights reserved.</span>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="/auth" className="hover:text-foreground transition-colors">Terms of Use</a>
              <span>·</span>
              <span>Vantage Mod · Vantage Gaming · Vantage MineHub</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
