import { ReactNode, useEffect } from "react";
import { Navbar } from "./Navbar";
import { MessageCircle } from "lucide-react";

export function AppLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.title = "Vantage Gamer MineHub - Minecraft Mods & Tools";
    
    // Add meta tags if they don't exist
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'The definitive Minecraft modding hub for the Vantage Army. Download safe, curated mods, tools, textures, and shaders.');
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {children}
      </main>
      
      {/* Simple Footer */}
      <footer className="border-t border-border/40 py-6 md:py-8 mt-auto">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-bold tracking-tight">Vantage MineHub</span>
            <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Vantage Army. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/message/VANTAGE" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
