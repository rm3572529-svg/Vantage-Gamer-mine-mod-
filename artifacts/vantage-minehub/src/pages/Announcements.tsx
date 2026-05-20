import { AppLayout } from "@/components/layout/AppLayout";
import { useListAnnouncements } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Info, AlertTriangle, Gift, ArrowUpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Announcements() {
  const { data: announcements, isLoading } = useListAnnouncements();

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'giveaway': return <Gift className="h-5 w-5 text-pink-500" />;
      case 'update': return <ArrowUpCircle className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'giveaway': return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      case 'update': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 pb-12 max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 bg-card p-8 rounded-3xl border border-border/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              Announcements
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Stay up to date with the latest news, updates, and events from the Vantage Army team.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
          ) : !announcements?.length ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border/40 rounded-2xl">
              No announcements at this time.
            </div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="bg-card border border-border/40 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row gap-6">
                {announcement.pinned && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-xs font-bold px-8 py-1 rotate-45 translate-x-[30%] translate-y-[50%] shadow-sm">
                      PINNED
                    </div>
                  </div>
                )}
                
                <div className="shrink-0 flex items-start mt-1">
                  <div className="w-12 h-12 rounded-xl bg-background border border-border/40 flex items-center justify-center">
                    {getIcon(announcement.type)}
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold">{announcement.title}</h2>
                    <Badge variant="outline" className={`capitalize ${getBadgeColor(announcement.type)}`}>
                      {announcement.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="prose prose-invert prose-sm max-w-none text-muted-foreground text-pretty whitespace-pre-wrap">
                    {announcement.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
