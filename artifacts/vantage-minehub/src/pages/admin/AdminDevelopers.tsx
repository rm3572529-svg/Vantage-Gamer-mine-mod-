import { useAdmin } from "@/contexts/AdminContext";
import { Link, useLocation } from "wouter";
import { useAdminListDevelopers, useAdminApproveDeveloper, useAdminBanDeveloper } from "@workspace/api-client-react";
import { ShieldCheck, LogOut, Check, Ban, ExternalLink, Youtube, MessageCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDevelopers() {
  const { isAuthenticated, logout } = useAdmin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: developers, isLoading, refetch } = useAdminListDevelopers({ status: "pending" });
  const approveMutation = useAdminApproveDeveloper();
  const banMutation = useAdminBanDeveloper();

  if (!isAuthenticated) {
    setLocation("/admin");
    return null;
  }

  const handleApprove = (id: string) => {
    approveMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Developer approved" });
        refetch();
      }
    });
  };

  const handleReject = (id: string) => {
    banMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Developer rejected/banned" });
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
            <span className="font-semibold">Developer Applications</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Pending Applications</h1>

        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
          ) : !developers?.length ? (
            <div className="bg-card border border-border/40 rounded-2xl p-12 text-center text-muted-foreground">
              No pending developer applications at this time.
            </div>
          ) : (
            developers.map((dev) => (
              <div key={dev.id} className="bg-card border border-border/40 rounded-2xl p-6 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary shrink-0">
                      {dev.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        {dev.name}
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">{dev.status}</Badge>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">User ID: {dev.userId}</p>
                      <p className="text-sm text-muted-foreground">Applied: {new Date(dev.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">About Application</h4>
                    <p className="text-sm text-muted-foreground bg-background p-4 rounded-xl border border-border/40">
                      {dev.about || "No bio provided."}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-80 shrink-0 space-y-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Contact & Links</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-background border border-border/40">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium">{dev.phone || "Not provided"}</span>
                      </div>
                      {dev.youtubeLink && (
                        <a href={dev.youtubeLink} target="_blank" rel="noreferrer" className="flex items-center justify-between text-sm p-2 rounded-lg bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors">
                          <span className="flex items-center gap-2 text-red-500"><Youtube className="h-4 w-4"/> YouTube</span>
                          <ExternalLink className="h-4 w-4 text-red-500" />
                        </a>
                      )}
                      {dev.telegram && (
                        <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-blue-500/5 border border-blue-500/20">
                          <span className="flex items-center gap-2 text-blue-500"><MessageCircle className="h-4 w-4"/> Telegram</span>
                          <span className="font-medium text-blue-500">@{dev.telegram}</span>
                        </div>
                      )}
                      {dev.instagram && (
                        <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-pink-500/5 border border-pink-500/20">
                          <span className="flex items-center gap-2 text-pink-500"><Instagram className="h-4 w-4"/> Instagram</span>
                          <span className="font-medium text-pink-500">@{dev.instagram}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(dev.id)}>
                      <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                    <Button variant="outline" className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20" onClick={() => handleReject(dev.id)}>
                      <Ban className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
