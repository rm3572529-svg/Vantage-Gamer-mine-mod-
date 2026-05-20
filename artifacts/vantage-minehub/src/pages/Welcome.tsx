import { Link, useLocation } from "wouter";
import { Shield, Smartphone, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md p-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to Vantage Army</h1>
            <p className="text-muted-foreground leading-relaxed">
              Our official website. Here you can find all Minecraft tools and mods. You can also upload and promote your own content.
            </p>
          </div>
          
          <div className="w-full space-y-3 pt-4">
            <Button size="lg" className="w-full h-12 text-md font-semibold" asChild>
              <Link href="/auth">
                <User className="mr-2 h-5 w-5" />
                Create Account / Login
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="w-full h-12 text-md font-medium border-border/40" asChild>
              <Link href="/">
                Continue as Guest
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="pt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Smartphone className="w-4 h-4" />
            <span>Optimized for mobile devices</span>
          </div>
        </div>
      </div>
    </div>
  );
}
