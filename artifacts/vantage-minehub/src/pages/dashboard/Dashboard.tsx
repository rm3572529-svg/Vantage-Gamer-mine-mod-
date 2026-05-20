import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Upload, Star, Users, Package, ArrowRight, LayoutDashboard, Settings, Plus, Activity } from "lucide-react";
import { useListMods, useGetDeveloper } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // In a real app we'd fetch the developer's stats using their user ID
  // For the mockup we just use generic hooks
  const { data: modsData, isLoading: modsLoading } = useListMods({ limit: 5 });

  if (!user || user.role !== 'developer') {
    setLocation("/profile");
    return null;
  }

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row gap-8 pb-12">
        {/* Dashboard Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <div className="flex items-center gap-3 p-4 bg-card border border-border/40 rounded-2xl mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold truncate">{user.username}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Developer</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-1">
            <Button variant="secondary" className="justify-start gap-3 h-12 rounded-xl bg-card border-border/40">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-card" asChild>
              <Link href="/dashboard/my-uploads">
                <Package className="h-4 w-4 text-muted-foreground" />
                My Uploads
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-card" asChild>
              <Link href="/dashboard/upload">
                <Upload className="h-4 w-4 text-muted-foreground" />
                Upload New Mod
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-card">
              <Settings className="h-4 w-4 text-muted-foreground" />
              Settings
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <Button asChild className="rounded-full">
              <Link href="/dashboard/upload">
                <Plus className="mr-2 h-4 w-4" />
                New Upload
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border/40 rounded-2xl p-6 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                <Upload className="h-5 w-5" />
              </div>
              <span className="text-3xl font-bold">12</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Uploads</span>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-6 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-2">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-3xl font-bold">1.2k</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Followers</span>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-6 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-500 mb-2">
                <Star className="h-5 w-5" />
              </div>
              <span className="text-3xl font-bold">4.5k</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Likes</span>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-6 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-2">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-3xl font-bold">89k</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Downloads</span>
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="bg-card border border-border/40 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Uploads</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/my-uploads">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {modsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {modsData?.mods?.slice(0, 3).map((mod) => (
                  <div key={mod.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-background/50 hover:bg-background transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                      {mod.bannerImage ? (
                        <img src={mod.bannerImage} alt={mod.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate text-sm">{mod.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{mod.category} • v{mod.version}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground mr-4">
                        <span className="flex items-center gap-1"><Upload className="w-3 h-3"/> {mod.downloadCount}</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3"/> {mod.likeCount}</span>
                      </div>
                      <Badge variant="outline" className={
                        mod.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        mod.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        mod.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''
                      }>
                        {mod.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
