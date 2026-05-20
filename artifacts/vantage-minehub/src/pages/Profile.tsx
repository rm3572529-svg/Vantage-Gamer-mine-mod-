import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { User, Shield, Mail, Smartphone, Upload, LogOut, ArrowRight, Activity, Settings, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) {
    setLocation("/welcome");
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 pb-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>

        <div className="bg-card border border-border/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
          
          <div className="w-32 h-32 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center text-4xl font-bold text-primary shadow-lg shrink-0 z-10">
            {user.username.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 text-center md:text-left z-10 flex flex-col items-center md:items-start space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <Badge variant="secondary" className="capitalize">
                  {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : null}
                  {user.role}
                </Badge>
                <Badge variant="outline" className="capitalize text-muted-foreground">
                  {user.loginProvider} Login
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2 w-full max-w-md">
              {user.email && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 p-3 rounded-xl border border-border/40">
                  <Mail className="w-4 h-4 text-primary" />
                  {user.email}
                </div>
              )}
              {user.loginProvider === 'phone' && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 p-3 rounded-xl border border-border/40">
                  <Smartphone className="w-4 h-4 text-primary" />
                  {user.username}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border/40 rounded-3xl p-6 space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Account Status
            </h3>
            
            {user.role === 'user' && !user.isGuest && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You are currently a Normal User. Want to upload your own mods and share them with the community?
                </p>
                <Button className="w-full" asChild>
                  <Link href="/become-developer">
                    Apply to be a Developer
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}
            
            {user.role === 'developer' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You are an approved Developer. You can upload mods and manage your content.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/dashboard">
                    Go to Developer Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}
            
            {user.role === 'admin' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You have Administrator privileges.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/admin/dashboard">
                    Go to Admin Panel
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}
            
            {user.isGuest && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You are browsing as a Guest. Create an account to download mods and interact with the community.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/auth">
                    Create Account
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
          
          <div className="bg-card border border-border/40 rounded-3xl p-6 space-y-4 flex flex-col">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Settings
            </h3>
            
            <div className="flex-1 space-y-2">
              <Button variant="outline" className="w-full justify-start h-12 border-border/40" disabled>
                <Bell className="mr-3 h-4 w-4" />
                Notification Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 border-border/40" disabled>
                <User className="mr-3 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            
            <Button variant="destructive" className="w-full mt-auto" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
