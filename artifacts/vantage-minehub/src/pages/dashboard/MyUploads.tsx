import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Upload, LayoutDashboard, Package, Settings, Edit, Trash2, ExternalLink } from "lucide-react";
import { useListMods } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function MyUploads() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch only this developer's mods
  const { data: modsData, isLoading } = useListMods();

  if (!user || user.role !== 'developer') {
    setLocation("/profile");
    return null;
  }

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row gap-8 pb-12">
        {/* Dashboard Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <nav className="flex flex-col gap-1">
            <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-card" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                Overview
              </Link>
            </Button>
            <Button variant="secondary" className="justify-start gap-3 h-12 rounded-xl bg-card border-border/40 cursor-default">
              <Package className="h-4 w-4" />
              My Uploads
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
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">My Uploads</h1>
          </div>

          <div className="bg-card border border-border/40 rounded-3xl p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
              </div>
            ) : !modsData?.mods?.length ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold">No uploads found</h3>
                <p className="text-muted-foreground mt-2">You haven't uploaded any mods yet.</p>
                <Button className="mt-6" asChild>
                  <Link href="/dashboard/upload">Upload your first mod</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {modsData.mods.map((mod) => (
                  <div key={mod.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-border/40 bg-background/50 hover:bg-background transition-colors">
                    <div className="w-full sm:w-32 h-32 sm:h-20 rounded-lg bg-muted overflow-hidden shrink-0 relative">
                      {mod.bannerImage ? (
                        <img src={mod.bannerImage} alt={mod.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/20" />
                      )}
                      <div className="absolute top-2 right-2 sm:hidden">
                        <Badge variant="outline" className={
                          mod.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          mod.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          mod.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''
                        }>
                          {mod.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold truncate text-base">{mod.title}</h4>
                        <Badge variant="outline" className="hidden sm:inline-flex bg-card text-[10px] h-5 capitalize">{mod.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">v{mod.version} • {new Date(mod.createdAt).toLocaleDateString()}</p>
                      <div className="hidden sm:inline-block">
                        <Badge variant="outline" className={
                          mod.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          mod.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          mod.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''
                        }>
                          {mod.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 mt-2 sm:mt-0 justify-end">
                      {mod.status === 'approved' && (
                        <Button size="icon" variant="ghost" asChild title="View Public Page">
                          <Link href={`/mods/${mod.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
