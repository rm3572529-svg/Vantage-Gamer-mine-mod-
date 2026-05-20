import { useAdmin } from "@/contexts/AdminContext";
import { Link, useLocation } from "wouter";
import { useListAnnouncements, useCreateAnnouncement } from "@workspace/api-client-react";
import { ShieldCheck, LogOut, Plus, Megaphone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminAnnouncements() {
  const { isAuthenticated, logout } = useAdmin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: announcements, isLoading, refetch } = useListAnnouncements();
  const createMutation = useCreateAnnouncement();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"info" | "warning" | "giveaway" | "update">("info");
  const [pinned, setPinned] = useState(false);

  if (!isAuthenticated) {
    setLocation("/admin");
    return null;
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ data: { title, content, type, pinned } }, {
      onSuccess: () => {
        toast({ title: "Announcement published" });
        setIsOpen(false);
        setTitle("");
        setContent("");
        setType("info");
        setPinned(false);
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
            <span className="font-semibold">Announcements</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Manage Announcements</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={type} onValueChange={(v: any) => setType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="giveaway">Giveaway</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea value={content} onChange={e => setContent(e.target.value)} required className="min-h-[100px]" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="pinned" checked={pinned} onCheckedChange={(v) => setPinned(v as boolean)} />
                  <label htmlFor="pinned" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Pin to top
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Publishing..." : "Publish Announcement"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden">
          <div className="divide-y divide-border/40">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            ) : !announcements?.length ? (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                <Megaphone className="h-8 w-8 mb-2 opacity-50" />
                No announcements created yet.
              </div>
            ) : (
              announcements.map((a) => (
                <div key={a.id} className="p-6 flex flex-col md:flex-row gap-4 justify-between items-start hover:bg-accent/50 transition-colors">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{a.title}</h3>
                      {a.pinned && <Badge className="bg-primary text-primary-foreground text-[10px]">PINNED</Badge>}
                      <Badge variant="outline" className="text-[10px] capitalize bg-background">{a.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                    <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
