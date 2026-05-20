import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Download, Users, Package, Star, Shield, ArrowRight } from "lucide-react";
import { useGetPlatformStats } from "@workspace/api-client-react";

export default function Home() {
  const { data: stats } = useGetPlatformStats();

  return (
    <AppLayout>
      <div className="flex flex-col gap-12 pb-12">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden bg-card border border-border/40 p-8 md:p-12 lg:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-6 max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary w-fit mx-auto md:mx-0">
              <Star className="mr-1.5 h-3.5 w-3.5 fill-primary" />
              Official Vantage Army Platform
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              The Definitive Hub for <span className="text-primary">Minecraft Mods</span>
            </h1>
            
            <p className="text-lg text-muted-foreground text-pretty max-w-xl mx-auto md:mx-0">
              Download safe, curated mods, tools, textures and shaders from top developers in the Vantage community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Button size="lg" className="rounded-full font-semibold h-12 px-8" asChild>
                <Link href="/mods">
                  Explore Mods
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full font-semibold h-12 px-8 border-border/60 bg-background/50 backdrop-blur" asChild>
                <Link href="/developers">
                  View Creators
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Stats Widget */}
          <div className="relative z-10 grid grid-cols-2 gap-4 w-full md:w-auto mt-8 md:mt-0">
            <div className="bg-background/80 backdrop-blur border border-border/40 rounded-2xl p-6 flex flex-col items-center justify-center min-w-[140px]">
              <Download className="h-6 w-6 text-primary mb-2" />
              <span className="text-3xl font-bold">{stats?.totalDownloads || '0'}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Downloads</span>
            </div>
            <div className="bg-background/80 backdrop-blur border border-border/40 rounded-2xl p-6 flex flex-col items-center justify-center min-w-[140px]">
              <Package className="h-6 w-6 text-primary mb-2" />
              <span className="text-3xl font-bold">{stats?.totalMods || '0'}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Total Mods</span>
            </div>
            <div className="bg-background/80 backdrop-blur border border-border/40 rounded-2xl p-6 flex flex-col items-center justify-center min-w-[140px]">
              <Users className="h-6 w-6 text-primary mb-2" />
              <span className="text-3xl font-bold">{stats?.totalDevelopers || '0'}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Creators</span>
            </div>
            <div className="bg-background/80 backdrop-blur border border-border/40 rounded-2xl p-6 flex flex-col items-center justify-center min-w-[140px]">
              <Shield className="h-6 w-6 text-primary mb-2" />
              <span className="text-3xl font-bold">100%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Secure</span>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['Mods', 'Tools', 'Textures', 'Shaders', 'Utilities'].map((cat) => (
              <Link key={cat} href={`/mods?category=${cat.toLowerCase()}`} className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-card border border-border/40 hover:border-primary/50 hover:bg-accent transition-all">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Package className="h-6 w-6" />
                </div>
                <span className="font-medium text-sm">{cat}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
