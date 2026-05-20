import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useListDevelopers } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, Upload, Star, Award, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Developers() {
  const { data: developers, isLoading } = useListDevelopers({ sort: 'trending' });

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 pb-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-8 rounded-3xl border border-border/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Creator Directory</h1>
            <p className="text-muted-foreground max-w-xl">
              Meet the talented developers behind the best mods on Vantage Army. 
              Follow your favorites to get notified of their latest releases.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-72 mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search creators..." 
              className="pl-9 bg-background/50 backdrop-blur border-border/60"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers?.map((dev) => (
              <Link key={dev.id} href={`/developers/${dev.id}`} className="group relative bg-card border border-border/40 rounded-2xl p-6 hover:border-primary/50 transition-colors flex flex-col items-center text-center gap-4">
                {dev.badges && dev.badges.includes('vip') && (
                  <div className="absolute top-4 right-4 text-amber-500 bg-amber-500/10 p-1.5 rounded-full">
                    <Award className="h-4 w-4" />
                  </div>
                )}
                
                <div className="w-20 h-20 rounded-full bg-muted border-4 border-background overflow-hidden shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center bg-gradient-to-br from-primary/20 to-blue-500/20">
                  {dev.avatar ? (
                    <img src={dev.avatar} alt={dev.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-foreground/50">{dev.name.charAt(0)}</span>
                  )}
                </div>
                
                <div>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors flex items-center justify-center gap-2">
                    {dev.name}
                    {dev.badges && dev.badges.includes('verified') && (
                      <Award className="h-4 w-4 text-primary" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2 px-4 h-10">
                    {dev.about || "Minecraft mod developer."}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 mt-2 w-full pt-4 border-t border-border/40">
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{dev.uploadsCount}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Upload className="h-3 w-3"/> Mods</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{dev.followersCount}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3"/> Followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{dev.likesCount}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3"/> Likes</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
