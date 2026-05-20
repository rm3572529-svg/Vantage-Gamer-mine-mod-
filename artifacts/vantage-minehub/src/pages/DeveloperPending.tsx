import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Clock, ArrowLeft } from "lucide-react";

export default function DeveloperPending() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) {
    setLocation("/welcome");
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 text-center gap-8">
        <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center border-4 border-yellow-500/20 text-yellow-500">
          <Clock className="w-12 h-12 animate-pulse" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Application Pending</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-lg mx-auto">
            Your developer application has been submitted successfully and is currently under review by our administration team.
          </p>
          <p className="text-sm text-muted-foreground bg-card p-4 rounded-xl border border-border/40 mt-4">
            This process usually takes 24-48 hours. We will notify you once a decision has been made.
          </p>
        </div>

        <Button variant="outline" asChild className="mt-4">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
      </div>
    </AppLayout>
  );
}
