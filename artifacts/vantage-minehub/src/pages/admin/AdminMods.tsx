import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Link, useLocation } from "wouter";
import { useAdminListMods, useAdminApproveMod, useAdminRejectMod, getAdminListModsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, LogOut, Search, Check, X, ExternalLink, Star, Crown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Status = "pending" | "approved" | "rejected" | "suspended";

const STATUS_TABS: { label: string; value: Status | "all" }[] = [
  { label: "Pending Review", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All Mods", value: "all" },
];

export default function AdminMods() {
  const { isAuthenticated, logout } = useAdmin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Status | "all">("pending");
  const [search, setSearch] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const queryClient = useQueryClient();

  const queryParams = activeTab === "all" ? {} : { status: activeTab };
  const { data, isLoading, refetch } = useAdminListMods(queryParams);
  const approveMutation = useAdminApproveMod();
  const rejectMutation = useAdminRejectMod();

  if (!isAuthenticated) {
    setLocation("/admin");
    return null;
  }

  const filtered = (data?.mods ?? []).filter((m) =>
    !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.developerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = (id: string) => {
    approveMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Mod approved — now visible to all users." });
        refetch();
      }
    });
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) { toast({ title: "Please enter a rejection reason", variant: "destructive" }); return; }
    rejectMutation.mutate({ id, data: { reason: rejectReason } }, {
      onSuccess: () => {
        toast({ title: "Mod rejected." });
        setRejectId(null);
        setRejectReason("");
        refetch();
      }
    });
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await fetch(`/api/admin/mods/${id}/featured`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !current }),
    });
    toast({ title: current ? "Removed from featured" : "Marked as featured" });
    refetch();
  };

  const toggleVip = async (id: string, current: boolean) => {
    await fetch(`/api/admin/mods/${id}/vip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vip: !current }),
    });
    toast({ title: current ? "Removed VIP status" : "Marked as VIP" });
    refetch();
  };

  const badgeClass = (status: string) =>
    status === "approved" ? "bg-green-500/10 text-green-500 border-green-500/20" :
    status === "pending" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
    status === "rejected" ? "bg-red-500/10 text-red-500 border-red-500/20" :
    "bg-muted text-muted-foreground";

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
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-card border border-border/40 rounded-xl w-fit">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {tab.label}
              {tab.value === "pending" && (data?.total ?? 0) > 0 && activeTab !== "pending" && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{data?.total}</span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or developer..." className="pl-9 bg-card border-border/40" />
        </div>

        {/* Reject reason prompt */}
        {rejectId && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex gap-4 items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-3">
              <p className="font-semibold text-red-500">Enter rejection reason</p>
              <Input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. Malicious link, incorrect format..." className="bg-background/50" />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleReject(rejectId)} className="bg-red-500 hover:bg-red-600 text-white">Confirm Reject</Button>
                <Button size="sm" variant="outline" onClick={() => { setRejectId(null); setRejectReason(""); }}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          ) : !filtered.length ? (
            <div className="p-16 text-center text-muted-foreground">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="font-medium">No mods in this queue</p>
              <p className="text-sm mt-1">All clear.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {filtered.map((mod) => (
                <div key={mod.id} className="p-4 sm:p-5 flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-muted shrink-0 border border-border/40 overflow-hidden">
                      {mod.bannerImage
                        ? <img src={mod.bannerImage} alt={mod.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-xl">{mod.title[0]}</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold truncate">{mod.title}</h3>
                        <Badge variant="outline" className="text-[10px] uppercase">{mod.category}</Badge>
                        <Badge variant="outline" className={badgeClass(mod.status)}>{mod.status}</Badge>
                        {mod.featured && <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-[10px]"><Star className="h-3 w-3 mr-1" />Featured</Badge>}
                        {mod.vip && <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30 text-[10px]"><Crown className="h-3 w-3 mr-1" />VIP</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{mod.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>By: <span className="text-foreground font-medium">{mod.developerName}</span></span>
                        <span>v{mod.version}</span>
                        <span>{new Date(mod.createdAt).toLocaleDateString()}</span>
                        <span>{mod.downloadCount} downloads</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/30">
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => window.open(mod.downloadLink, "_blank")}>
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />Inspect Link
                    </Button>

                    {mod.status === "pending" && (
                      <>
                        <Button size="sm" className="h-8 text-xs bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20" variant="outline" onClick={() => handleApprove(mod.id)}>
                          <Check className="h-3.5 w-3.5 mr-1.5" />Approve
                        </Button>
                        <Button size="sm" className="h-8 text-xs bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20" variant="outline" onClick={() => setRejectId(mod.id)}>
                          <X className="h-3.5 w-3.5 mr-1.5" />Reject
                        </Button>
                      </>
                    )}

                    {mod.status === "approved" && (
                      <>
                        <Button size="sm" variant="outline" className={`h-8 text-xs border ${mod.featured ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" : "border-border/40"}`} onClick={() => toggleFeatured(mod.id, mod.featured ?? false)}>
                          <Star className="h-3.5 w-3.5 mr-1.5" />{mod.featured ? "Unfeature" : "Feature"}
                        </Button>
                        <Button size="sm" variant="outline" className={`h-8 text-xs border ${mod.vip ? "bg-purple-500/10 text-purple-500 border-purple-500/30" : "border-border/40"}`} onClick={() => toggleVip(mod.id, mod.vip ?? false)}>
                          <Crown className="h-3.5 w-3.5 mr-1.5" />{mod.vip ? "Remove VIP" : "Mark VIP"}
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-xs border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white" onClick={() => setRejectId(mod.id)}>
                          <X className="h-3.5 w-3.5 mr-1.5" />Suspend
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
