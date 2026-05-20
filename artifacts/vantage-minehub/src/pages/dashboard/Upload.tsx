import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Upload, LayoutDashboard, Package, Settings, Plus, Info, UploadCloud, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateMod } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const uploadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.enum(["mod", "tool", "texture", "shader", "utility"]),
  version: z.string().min(1, "Version is required"),
  changelog: z.string().optional(),
  downloadLink: z.string().url("Must be a valid URL (MediaFire preferred)"),
  setupVideo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  gameplayVideo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  bannerImage: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
});

export default function UploadMod() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createMutation = useCreateMod();

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "mod",
      version: "1.0.0",
      changelog: "",
      downloadLink: "",
      setupVideo: "",
      gameplayVideo: "",
      bannerImage: "",
    },
  });

  if (!user || user.role !== 'developer') {
    setLocation("/profile");
    return null;
  }

  const onSubmit = (values: z.infer<typeof uploadSchema>) => {
    createMutation.mutate({ data: {
      ...values,
      tags: [] // Simplified for mockup
    } }, {
      onSuccess: () => {
        toast({ title: "Mod uploaded successfully! Waiting for approval." });
        setLocation("/dashboard/my-uploads");
      },
      onError: () => {
        toast({ title: "Failed to upload mod", variant: "destructive" });
      }
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row gap-8 pb-12">
        {/* Dashboard Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <nav className="flex flex-col gap-1">
            <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-card" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                Overview
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-card" asChild>
              <Link href="/dashboard/my-uploads">
                <Package className="h-4 w-4 text-muted-foreground" />
                My Uploads
              </Link>
            </Button>
            <Button variant="secondary" className="justify-start gap-3 h-12 rounded-xl bg-card border-border/40 cursor-default">
              <Upload className="h-4 w-4" />
              Upload New Mod
            </Button>
            <Button variant="ghost" className="justify-start gap-3 h-12 rounded-xl hover:bg-card">
              <Settings className="h-4 w-4 text-muted-foreground" />
              Settings
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <h1 className="text-3xl font-bold tracking-tight">Upload New Mod</h1>

          <div className="bg-card border border-border/40 rounded-3xl p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/40 pb-2">
                    <Info className="w-5 h-5 text-primary" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Better Textures 4K" {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mod">Mod</SelectItem>
                                <SelectItem value="tool">Tool</SelectItem>
                                <SelectItem value="texture">Texture</SelectItem>
                                <SelectItem value="shader">Shader</SelectItem>
                                <SelectItem value="utility">Utility</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="version"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Version *</FormLabel>
                            <FormControl>
                              <Input placeholder="1.0.0" {...field} className="bg-background/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of your mod..." 
                            className="bg-background/50 min-h-[120px] resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="changelog"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Changelog</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What's new in this version?" 
                            className="bg-background/50 min-h-[80px] resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Media & Files */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/40 pb-2">
                    <UploadCloud className="w-5 h-5 text-primary" />
                    Media & Files
                  </h3>
                  
                  <div className="pt-2 space-y-6">
                    <FormField
                      control={form.control}
                      name="downloadLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Download Link (MediaFire, Google Drive, etc.) *</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bannerImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banner Image URL (16:9 recommended)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="setupVideo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Setup Guide Video (YouTube URL)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://youtube.com/..." {...field} className="bg-background/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gameplayVideo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gameplay Video (YouTube URL)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://youtube.com/..." {...field} className="bg-background/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 flex justify-end gap-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                  <Button type="submit" size="lg" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Uploading..." : "Submit for Review"}
                  </Button>
                </div>

              </form>
            </Form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
