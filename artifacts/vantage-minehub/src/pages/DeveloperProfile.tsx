import { Link, useParams } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetDeveloper, useListMods } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, Upload, Star, Award, Youtube, Instagram, MessageCircle, PackageOpen, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DeveloperProfile() {
  const { id } = useParams();
  const { data: dev, isLoading: isDevLoading } = useGetDeveloper(id || "");
  const { data: modsData, isLoading: isModsLoading } = useListMods({ search: id }); // Using search as placeholder for devId filtering

  if (isDevLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!dev) {
    return (
      <AppLayout>
        <div className="py-24 text-center">
          <h2 className="text-2xl font-bold">Developer not found</h2>
          <Button asChild className="mt-4">
            <Link href="/developers">Back to Directory</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 pb-12">
        {/* Profile Header */}
        <div className="bg-card border border-border/40 rounded-3xl overflow-hidden relative">
          <div className="h-32 md:h-48 bg-gradient-to-r from-primary/20 via-blue-500/10 to-primary/5 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          </div>
          
          <div className="px-6 md:px-10 pb-8 relative flex flex-col md:flex-row items-center md:items-end md:justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-card border-4 border-background overflow-hidden shadow-xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-blue-500/20 z-10 shrink-0">
                {dev.avatar ? (
                  <img src={dev.avatar} alt={dev.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-foreground/50">{dev.name.charAt(0)}</span>
                )}
              </div>
              
              <div className="text-center md:text-left mb-2 space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h1 className="text-3xl font-bold">{dev.name}</h1>
                  {dev.badges?.includes('verified') && (
                    <Award className="h-6 w-6 text-primary fill-primary/20" />
                  )}
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {dev.badges?.map(badge => (
                    <Badge key={badge} variant="secondary" className="capitalize bg-primary/10 text-primary border-primary/20">
                      {badge}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="bg-background">Joined {new Date(dev.createdAt).getFullYear()}</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Button size="lg" className="flex-1 md:flex-none rounded-full px-8 shadow-lg shadow-primary/20">
                Follow
              </Button>
            </div>
          </div>
          
          <div className="px-6 md:px-10 py-6 border-t border-border/40 bg-background/50 grid grid-cols-3 gap-4 md:w-max">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-bold">{dev.followersCount}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Followers</span>
            </div>
            <div className="flex flex-col items-center md:items-start md:px-8 md:border-x border-border/40">
              <span className="text-2xl font-bold">{dev.uploadsCount}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Uploads</span>
            </div>
            <div className="flex flex-col items-center md:items-start md:pl-8">
              <span className="text-2xl font-bold">{dev.likesCount}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Likes</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-lg">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {dev.about || "This developer hasn't written a bio yet."}
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-lg">Social Links</h3>
              <div className="space-y-3">
                {dev.youtubeLink && (
                  <a href={dev.youtubeLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10">
                    <Youtube className="h-5 w-5" />
                    <span>{dev.youtubeChannelName || "YouTube Channel"}</span>
                  </a>
                )}
                {dev.instagram && (
                  <a href={`https://instagram.com/${dev.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm hover:text-pink-500 transition-colors p-2 rounded-lg hover:bg-pink-500/10">
                    <Instagram className="h-5 w-5" />
                    <span>@{dev.instagram}</span>
                  </a>
                )}
                {dev.telegram && (
                  <a href={`https://t.me/${dev.telegram}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-500/10">
                    <MessageCircle className="h-5 w-5" />
                    <span>@{dev.telegram}</span>
                  </a>
                )}
                {!dev.youtubeLink && !dev.instagram && !dev.telegram && (
                  <p className="text-sm text-muted-foreground">No social links provided.</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Uploads by {dev.name}
            </h3>

            {isModsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
              </div>
            ) : !modsData?.mods?.length ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border/60 rounded-2xl bg-card/30">
                <PackageOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <h4 className="font-semibold">No uploads yet</h4>
                <p className="text-sm text-muted-foreground mt-1">This developer hasn't uploaded any mods.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modsData.mods.map((mod) => (
                  <Link key={mod.id} href={`/mods/${mod.id}`} className="group flex gap-4 p-4 rounded-xl bg-card border border-border/40 hover:border-primary/50 transition-colors">
                    <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
                      {mod.bannerImage ? (
                        <img src={mod.bannerImage} alt={mod.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-blue-500/20" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 py-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] px-1.5 h-5">{mod.category}</Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="h-3 w-3"/> {mod.likeCount}</span>
                      </div>
                      <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{mod.title}</h4>
                      <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Download className="h-3 w-3"/> {mod.downloadCount}</span>
                        <span>v{mod.version}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
