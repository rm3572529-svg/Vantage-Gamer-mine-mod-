import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Download, Users, Package, Star, Shield, ArrowRight, Cpu, Layers, Palette, Zap, Bell, Trophy } from "lucide-react";
import { useGetPlatformStats, useGetTrendingMods, useListDevelopers, useListAnnouncements } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { label: "Mods", value: "mod", icon: Cpu },
  { label: "Tools", value: "tool", icon: Layers },
  { label: "Textures", value: "texture", icon: Palette },
  { label: "Shaders", value: "shader", icon: Zap },
  { label: "Utilities", value: "utility", icon: Package },
];

const ANNOUNCEMENT_COLORS = {
  info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  giveaway: "bg-green-500/10 border-green-500/20 text-green-400",
  update: "bg-primary/10 border-primary/20 text-primary",
};

export default function Home() {
  const { data: stats } = useGetPlatformStats();
  const { data: trendingMods } = useGetTrendingMods();
  const { data: developers } = useListDevelopers({ sort: "featured" });
  const { data: announcements } = useListAnnouncements();

  const hasTrending = (trendingMods?.length ?? 0) > 0;
  const hasDevelopers = (developers?.length ?? 0) > 0;
  const hasAnnouncements = (announcements?.length ?? 0) > 0;

  return (
    <AppLayout>
      <div className="flex flex-col gap-12 pb-12">

        {/* Hero */}
        <section className="relative rounded-3xl overflow-hidden bg-card border border-border/40 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-5 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary w-fit mx-auto md:mx-0">
              <Star className="mr-1.5 h-3.5 w-3.5 fill-primary" />
              Official Vantage Army Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              The Definitive Hub<br />for <span className="text-primary">Minecraft Mods</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto md:mx-0">
              Download safe, curated mods, tools, textures and shaders from top developers in the Vantage community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button size="lg" className="rounded-full font-semibold h-12 px-8" asChild>
                <Link href="/mods">Explore Mods <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full font-semibold h-12 px-8 border-border/60 bg-background/50" asChild>
                <Link href="/developers">View Creators</Link>
              </Button>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            {[
              { icon: Download, label: "Downloads", value: stats?.totalDownloads ?? 0 },
              { icon: Package, label: "Total Mods", value: stats?.totalMods ?? 0 },
              { icon: Users, label: "Creators", value: stats?.totalDevelopers ?? 0 },
              { icon: Shield, label: "Secure", value: "100%" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-background/80 backdrop-blur border border-border/40 rounded-2xl p-5 flex flex-col items-center justify-center min-w-[130px] gap-1">
                <Icon className="h-5 w-5 text-primary mb-1" />
                <span className="text-2xl font-bold">{value}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Announcements */}
        {hasAnnouncements && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Announcements</h2>
            </div>
            <div className="flex flex-col gap-3">
              {announcements!.slice(0, 3).map((ann) => (
                <div key={ann.id} className={`border rounded-xl px-5 py-4 flex items-start gap-3 ${ANNOUNCEMENT_COLORS[ann.type as keyof typeof ANNOUNCEMENT_COLORS] ?? ANNOUNCEMENT_COLORS.info}`}>
                  {ann.pinned && <Badge className="shrink-0 bg-primary/20 text-primary border-primary/30 text-[10px]">PINNED</Badge>}
                  <div>
                    <p className="font-semibold">{ann.title}</p>
                    <p className="text-sm opacity-80 mt-0.5">{ann.content}</p>
                  </div>
                  <span className="ml-auto text-xs opacity-60 shrink-0">{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
              {(announcements?.length ?? 0) > 3 && (
                <Link href="/announcements" className="text-sm text-primary hover:underline text-center">
                  View all announcements →
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="space-y-5">
          <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map(({ label, value, icon: Icon }) => (
              <Link key={value} href={`/mods?category=${value}`} className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-card border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="font-semibold text-sm">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Mods */}
        {hasTrending ? (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h2 className="text-2xl font-bold">Trending Mods</h2>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/mods?sort=trending">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingMods!.slice(0, 6).map((mod) => (
                <Link key={mod.id} href={`/mods/${mod.id}`} className="group bg-card border border-border/40 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
                  <div className="h-36 bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                    {mod.bannerImage && <img src={mod.bannerImage} alt={mod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                    {mod.featured && (
                      <div className="absolute top-3 left-3 bg-yellow-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="h-3 w-3" /> Featured
                      </div>
                    )}
                    {mod.vip && (
                      <div className="absolute top-3 right-3 bg-purple-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">VIP</div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold truncate">{mod.title}</h3>
                      <Badge variant="outline" className="text-[10px] uppercase shrink-0">{mod.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{mod.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span>{mod.developerName}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Download className="h-3 w-3" />{mod.downloadCount}</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3" />{mod.likeCount}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-border/60 p-12 text-center space-y-3">
            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <h3 className="font-bold text-lg">No mods yet</h3>
            <p className="text-muted-foreground text-sm">Be the first to upload a mod to the Vantage community.</p>
            <Button className="mt-2" asChild><Link href="/become-developer">Become a Developer</Link></Button>
          </section>
        )}

        {/* Featured Developers */}
        {hasDevelopers ? (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Featured Creators</h2>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/developers">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {developers!.slice(0, 6).map((dev) => (
                <Link key={dev.id} href={`/developers/${dev.id}`} className="group bg-card border border-border/40 rounded-2xl p-5 hover:border-primary/40 transition-all flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                    {dev.avatar ? <img src={dev.avatar} alt={dev.name} className="w-full h-full rounded-full object-cover" /> : dev.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold truncate">{dev.name}</h3>
                      {dev.badges?.includes("verified") && <Shield className="h-3.5 w-3.5 text-blue-400 shrink-0" />}
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{dev.followersCount} followers</span>
                      <span>{dev.uploadsCount} uploads</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-border/60 p-10 text-center space-y-3">
            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <h3 className="font-bold text-lg">No creators yet</h3>
            <p className="text-muted-foreground text-sm">Apply to become a developer and start sharing your mods.</p>
            <Button className="mt-2" asChild><Link href="/become-developer">Apply Now</Link></Button>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
