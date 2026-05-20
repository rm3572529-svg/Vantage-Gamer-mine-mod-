import { Link } from "wouter";
import { Search, Menu, User, Download, Box, Layers, Settings2, Bell, ChevronRight, LogOut, Home, Compass } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mr-4 flex">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 border-r border-border/40">
              <MobileNav />
            </SheetContent>
          </Sheet>
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Box className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block tracking-tight">
              Vantage MineHub
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium hidden md:flex">
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/mods" className="transition-colors hover:text-primary">
              Mods
            </Link>
            <Link href="/developers" className="transition-colors hover:text-primary">
              Developers
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" className="inline-flex items-center rounded-full border border-border/40 bg-muted/30 px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:w-64 w-full justify-start h-9">
              <Search className="mr-2 h-4 w-4" />
              <span>Search mods...</span>
            </Button>
          </div>
          
          <nav className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                  <Bell className="h-4 w-4" />
                </Button>
                <Link href="/profile" className="flex items-center gap-2 border border-border/40 bg-card rounded-full pl-1 pr-3 py-1 hover:bg-accent transition-colors">
                  <div className="bg-primary/20 text-primary h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline-block max-w-[100px] truncate">{user.username}</span>
                </Link>
              </div>
            ) : (
              <Link href="/welcome" className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Log in
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const { user, logout } = useAuth();
  
  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 pb-6 flex items-center space-x-2">
        <Box className="h-6 w-6 text-primary" />
        <span className="font-bold tracking-tight text-lg">
          Vantage MineHub
        </span>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <Link href="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link href="/mods" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            <Compass className="h-4 w-4" />
            Explore Mods
          </Link>
          <Link href="/developers" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            <User className="h-4 w-4" />
            Developers
          </Link>
          <Link href="/announcements" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            <Bell className="h-4 w-4" />
            Announcements
          </Link>
        </nav>
      </div>
      
      <div className="mt-auto px-4 border-t border-border/40 pt-4">
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 text-primary h-10 w-10 rounded-full flex items-center justify-center font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user.username}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
              </div>
            </div>
            <div className="grid gap-1">
              <Link href="/profile" className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                <span>Profile Settings</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              {user.role === 'developer' && (
                <Link href="/dashboard" className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                  <span>Developer Dashboard</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              )}
              <button onClick={logout} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 w-full text-left">
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link href="/welcome" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 w-full">
              Log in to your account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
