import { useAdmin } from "@/contexts/AdminContext";
import { Link, useLocation } from "wouter";
import { useAdminListMods, useAdminApproveMod, useAdminRejectMod } from "@workspace/api-client-react";
import { ShieldCheck, LogOut, Search, Filter, Check, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminMods() {
  const { isAuthenticated, logout } = useAdmin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Use "pending" as default filter for mockup purposes
  const { data, isLoading, refetch } = useAdminListMods({ status: "pending" });
  const approveMutation = useAdminApproveMod();
  const rejectMutation = useAdminRejectMod();

  if (!isAuthenticated) {
    setLocation("/admin");
    return null;
  }

  const handleApprove = (id: string) => {
    approveMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Mod approved" });
        refetch();
      }
    });
  };

  const handleReject = (id: string) => {
    rejectMutation.mutate({ id, data: { reason: "Violation of terms" } }, {
      onSuccess: () => {
        toast({ title: "Mod rejected" });
        refetch();
      }
    });
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
            <span className="font-semibold">Moderate Mods</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search mods by title or developer ID..." className="pl-9 bg-card border-border/40" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none border-border/40 bg-card">
              <Filter className="mr-2 h-4 w-4" /> Filter Status
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          ) : !data?.mods?.length ? (
            <div className="p-12 text-center text-muted-foreground">
              No mods found in this queue.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {data.mods.map((mod) => (
                <div key={mod.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-accent/50 transition-colors">
                  <div className="w-16 h-16 rounded-lg bg-muted shrink-0 border border-border/40 overflow-hidden">
                    {mod.bannerImage ? (
                      <img src={mod.bannerImage} alt={mod.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary/20" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold truncate">{mod.title}</h3>
                      <Badge variant="outline" className="text-[10px] uppercase bg-background">{mod.category}</Badge>
                      <Badge variant="outline" className={
                        mod.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        mod.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        mod.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''
                      }>{mod.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{mod.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Dev: {mod.developerName} ({mod.developerId})</span>
                      <span>v{mod.version}</span>
                      <span>{new Date(mod.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => window.open(mod.downloadLink, '_blank')}>
                      <ExternalLink className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Inspect Link</span>
                    </Button>
                    
                    {mod.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline" className="flex-1 sm:flex-none bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border-green-500/20" onClick={() => handleApprove(mod.id)}>
                          <Check className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Approve</span>
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 sm:flex-none bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20" onClick={() => handleReject(mod.id)}>
                          <X className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Reject</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
