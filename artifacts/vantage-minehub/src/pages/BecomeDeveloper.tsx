import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApplyDeveloper } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Rocket } from "lucide-react";

const developerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(5, "Phone number is required"),
  youtubeChannelName: z.string().optional(),
  youtubeLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  instagram: z.string().optional(),
  telegram: z.string().optional(),
  about: z.string().min(20, "Tell us a bit more about yourself (min 20 chars)"),
});

export default function BecomeDeveloper() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const applyMutation = useApplyDeveloper();

  const form = useForm<z.infer<typeof developerSchema>>({
    resolver: zodResolver(developerSchema),
    defaultValues: {
      name: user?.username || "",
      phone: "",
      youtubeChannelName: "",
      youtubeLink: "",
      instagram: "",
      telegram: "",
      about: "",
    },
  });

  const onSubmit = (values: z.infer<typeof developerSchema>) => {
    applyMutation.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Application submitted successfully!" });
        setLocation("/developer-pending");
      },
      onError: () => {
        toast({ title: "Failed to submit application", variant: "destructive" });
      }
    });
  };

  if (!user || user.isGuest) {
    setLocation("/welcome");
    return null;
  }

  if (user.role === 'developer') {
    setLocation("/dashboard");
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-12">
        <Button variant="ghost" asChild className="w-fit -ml-4 text-muted-foreground">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
        </Button>

        <div className="bg-card border border-border/40 rounded-3xl p-8 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
          
          <div className="relative z-10 space-y-2">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Rocket className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Become a Developer</h1>
            <p className="text-muted-foreground">
              Join the Vantage Army creator program. Upload your mods, textures, and tools to share with thousands of players.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name / Developer Alias *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your alias" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+1..." {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="youtubeChannelName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube Channel Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="youtubeLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube Channel URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://youtube.com/..." {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram Username</FormLabel>
                      <FormControl>
                        <Input placeholder="@username" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telegram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram Username</FormLabel>
                      <FormControl>
                        <Input placeholder="@username" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About You *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your experience with Minecraft modding..." 
                        className="bg-background/50 min-h-[120px] resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 border-t border-border/40 flex justify-end">
                <Button type="submit" size="lg" className="w-full md:w-auto px-8" disabled={applyMutation.isPending}>
                  {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
}
