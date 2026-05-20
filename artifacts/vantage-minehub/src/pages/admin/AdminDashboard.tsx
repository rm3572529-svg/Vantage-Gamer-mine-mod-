import { useAdmin } from "@/contexts/AdminContext";
import { Link, useLocation } from "wouter";
import { useAdminGetStats } from "@workspace/api-client-react";
import { Users, Package, AlertTriangle, ShieldCheck, Download, Ban, LogOut, ArrowRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAdmin();
  const [, setLocation] = useLocation();
  const { data: stats } = useAdminGetStats();

  if (!isAuthenticated) {
    setLocation("/admin");
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-500 font-bold">
            <ShieldCheck className="h-6 w-6" />
            Vantage Admin
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            Exit System
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Admin Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <nav className="flex flex-col gap-1">
            <Button variant="secondary" className="justify-start gap-3 h-12 rounded-xl bg-card border-border/40 cursor-default">
              <ShieldCheck className="h-4 w-4 text-red-500" />
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-card" asChild>
              <Link href="/admin/mods">
                <Package className="h-4 w-4 text-muted-foreground" />
                Moderate Mods
                {stats?.pendingMods ? (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stats.pendingMods}</span>
                ) : null}
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-card" asChild>
              <Link href="/admin/developers">
                <Users className="h-4 w-4 text-muted-foreground" />
                Dev Applications
                {stats?.pendingDevelopers ? (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stats.pendingDevelopers}</span>
                ) : null}
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-card" asChild>
              <Link href="/admin/users">
                <Users className="h-4 w-4 text-muted-foreground" />
                Manage Users
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-card" asChild>
              <Link href="/admin/announcements">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                Announcements
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-card" asChild>
              <Link href="/admin/settings">
                <Settings className="h-4 w-4 text-muted-foreground" />
                Platform Settings
              </Link>
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
            <p className="text-muted-foreground mt-1">Platform statistics and pending actions.</p>
          </div>

          {/* Action Needed */}
          {((stats?.pendingMods ?? 0) > 0 || (stats?.pendingDevelopers ?? 0) > 0) && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-500">Action Required</h3>
                <p className="text-sm text-red-500/80 mt-1">
                  You have pending items waiting for moderation.
                </p>
                <div className="flex gap-4 mt-4">
                  {(stats?.pendingMods ?? 0) > 0 && (
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white" asChild>
                      <Link href="/admin/mods?status=pending">Review {stats?.pendingMods} Mods</Link>
                    </Button>
                  )}
                  {(stats?.pendingDevelopers ?? 0) > 0 && (
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white" asChild>
                      <Link href="/admin/developers?status=pending">Review {stats?.pendingDevelopers} Devs</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border/40 rounded-2xl p-6 flex flex-col gap-1">
              <span className="text-muted-foreground flex items-center gap-2 text-sm"><Package className="h-4 w-4" /> Total Mods</span>
              <span className="text-3xl font-bold">{stats?.totalMods || 0}</span>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-6 flex flex-col gap-1">
              <span className="text-muted-foreground flex items-center gap-2 text-sm"><Users className="h-4 w-4" /> Total Users</span>
              <span className="text-3xl font-bold">{stats?.totalUsers || 0}</span>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-6 flex flex-col gap-1">
              <span className="text-muted-foreground flex items-center gap-2 text-sm"><Download className="h-4 w-4" /> Total Downloads</span>
              <span className="text-3xl font-bold">{stats?.totalDownloads || 0}</span>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-6 flex flex-col gap-1">
              <span className="text-muted-foreground flex items-center gap-2 text-sm"><Users className="h-4 w-4" /> Approved Devs</span>
              <span className="text-3xl font-bold">{stats?.totalDevelopers || 0}</span>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-6 flex flex-col gap-1">
              <span className="text-muted-foreground flex items-center gap-2 text-sm"><Ban className="h-4 w-4" /> Banned Users</span>
              <span className="text-3xl font-bold">{stats?.bannedUsers || 0}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border/40 rounded-2xl p-6 border-t-4 border-t-primary">
              <h3 className="font-bold text-lg mb-2">Mod Moderation</h3>
              <p className="text-sm text-muted-foreground mb-6">Review uploaded files, approve safe content, and reject policy violations.</p>
              <Button className="w-full" asChild>
                <Link href="/admin/mods">Open Mod Queue <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="bg-card border border-border/40 rounded-2xl p-6 border-t-4 border-t-blue-500">
              <h3 className="font-bold text-lg mb-2">Creator Applications</h3>
              <p className="text-sm text-muted-foreground mb-6">Review users applying for developer status. Check their YouTube channels and background.</p>
              <Button className="w-full" asChild>
                <Link href="/admin/developers">Open Application Queue <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
