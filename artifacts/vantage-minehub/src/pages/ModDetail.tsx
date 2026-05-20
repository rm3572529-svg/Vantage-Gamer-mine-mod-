import { Link, useParams } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetMod, useGetModComments } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, Star, Share2, Info, Youtube, FileVideo, ChevronLeft, ShieldCheck, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ModDetail() {
  const { id } = useParams();
  const { data: mod, isLoading } = useGetMod(id || "");
  const { data: comments } = useGetModComments(id || "");
  
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [downloadStep, setDownloadStep] = useState(1);
  const [countdown, setCountdown] = useState(5);

  const startDownloadFlow = () => {
    setDownloadModalOpen(true);
    setDownloadStep(1);
  };

  const proceedToCountdown = () => {
    setDownloadStep(2);
    let count = 5;
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        setDownloadStep(3);
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!mod) {
    return (
      <AppLayout>
        <div className="py-24 text-center">
          <h2 className="text-2xl font-bold">Mod not found</h2>
          <Button asChild className="mt-4">
            <Link href="/mods">Back to Mods</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 pb-12">
        <Button variant="ghost" asChild className="w-fit -ml-4 text-muted-foreground">
          <Link href="/mods">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Mods
          </Link>
        </Button>

        {/* Hero Banner */}
        <div className="w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl bg-muted relative overflow-hidden border border-border/40 flex items-end">
          {mod.bannerImage ? (
            <img src={mod.bannerImage} alt={mod.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-blue-500/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
          
          <div className="relative z-10 p-6 md:p-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="capitalize bg-background/50 backdrop-blur">{mod.category}</Badge>
                <Badge variant="outline" className="bg-background/50 backdrop-blur">v{mod.version}</Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">{mod.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <Link href={`/developers/${mod.developerId}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <div className="w-6 h-6 rounded-full bg-primary/40 flex items-center justify-center font-bold text-xs text-white">
                    {mod.developerName.charAt(0)}
                  </div>
                  <span className="font-medium">{mod.developerName}</span>
                </Link>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Download className="h-4 w-4" /> {mod.downloadCount}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4" /> {mod.likeCount}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <Button size="icon" variant="outline" className="rounded-full bg-background/50 backdrop-blur border-border/40 text-white hover:bg-background/80">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full bg-background/50 backdrop-blur border-border/40 text-white hover:bg-background/80">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button size="lg" className="rounded-full font-bold px-8 shadow-lg shadow-primary/20" onClick={startDownloadFlow}>
                <Download className="mr-2 h-5 w-5" />
                Download
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Description */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                About this Mod
              </h2>
              <div className="prose prose-invert max-w-none text-muted-foreground text-pretty">
                <p>{mod.description}</p>
                {/* Simulated longer description since our mock data is short */}
                <p className="mt-4">This mod significantly enhances your Minecraft experience by adding new features, improving existing mechanics, and providing a seamless integration with other popular tools in the community.</p>
              </div>
            </section>

            {/* Screenshots */}
            {mod.screenshots && mod.screenshots.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileVideo className="h-5 w-5 text-primary" />
                  Screenshots & Media
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {mod.screenshots.map((img, idx) => (
                    <div key={idx} className="aspect-video rounded-xl bg-muted overflow-hidden border border-border/40">
                      <img src={img} alt={`Screenshot ${idx+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Videos */}
            {(mod.setupVideo || mod.gameplayVideo) && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-red-500" />
                  Videos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mod.setupVideo && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Installation Guide</h4>
                      <div className="aspect-video rounded-xl bg-card border border-border/40 flex items-center justify-center">
                        <Youtube className="h-10 w-10 text-muted-foreground/50" />
                        {/* Real implementation would embed iframe */}
                      </div>
                    </div>
                  )}
                  {mod.gameplayVideo && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Gameplay Showcase</h4>
                      <div className="aspect-video rounded-xl bg-card border border-border/40 flex items-center justify-center">
                        <Youtube className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Comments */}
            <section className="space-y-6 pt-6 border-t border-border/40">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Comments ({comments?.length || 0})
              </h2>
              
              <div className="bg-card border border-border/40 rounded-2xl p-4 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <textarea 
                    className="w-full bg-transparent border-none resize-none focus:outline-none text-sm placeholder:text-muted-foreground"
                    placeholder="Add a comment..."
                    rows={2}
                  />
                  <div className="flex justify-end">
                    <Button size="sm">Post Comment</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
                      {comment.username.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.username}</span>
                        <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm mt-1 text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-card border border-border/40 rounded-3xl p-6 space-y-6 sticky top-24">
              <Button className="w-full rounded-xl h-14 text-lg font-bold" onClick={startDownloadFlow}>
                <Download className="mr-2 h-5 w-5" />
                Download APK
              </Button>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">{mod.version}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="font-medium">{new Date(mod.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-muted-foreground">Security</span>
                  <span className="font-medium flex items-center text-green-500">
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    Verified Safe
                  </span>
                </div>
              </div>

              {mod.tags && mod.tags.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {mod.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-muted">#{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Download Flow Modal */}
      <Dialog open={downloadModalOpen} onOpenChange={setDownloadModalOpen}>
        <DialogContent className="max-w-md bg-card border-border/40 sm:rounded-3xl p-0 overflow-hidden">
          <div className="p-8 flex flex-col items-center text-center space-y-6">
            {downloadStep === 1 && (
              <div className="space-y-6 w-full animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                  <Youtube className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Support the Developer</h3>
                  <p className="text-muted-foreground text-sm mt-2">Subscribe to {mod.developerName}'s channel for more awesome mods!</p>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-12" onClick={proceedToCountdown}>
                  <Youtube className="mr-2 h-5 w-5" /> Subscribe on YouTube
                </Button>
                <Button variant="ghost" className="w-full" onClick={proceedToCountdown}>
                  Skip for now
                </Button>
              </div>
            )}

            {downloadStep === 2 && (
              <div className="space-y-6 w-full animate-in fade-in zoom-in-95">
                <h3 className="text-xl font-bold">Generating Download Link</h3>
                <div className="text-6xl font-black text-primary animate-pulse py-8">
                  {countdown}
                </div>
                <p className="text-sm text-muted-foreground">Please wait while we prepare your file...</p>
              </div>
            )}

            {downloadStep === 3 && (
              <div className="space-y-6 w-full animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Verify you are human</h3>
                  <p className="text-muted-foreground text-sm mt-2">One last step to keep our platform secure.</p>
                </div>
                <div className="p-4 border border-border/40 rounded-xl bg-background flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-6 h-6 rounded border-border" onChange={() => setDownloadStep(4)} />
                    <span className="font-medium">I am not a robot</span>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/RecaptchaLogo.svg/1200px-RecaptchaLogo.svg.png" alt="Captcha" className="h-8 opacity-50 grayscale" />
                </div>
              </div>
            )}

            {downloadStep === 4 && (
              <div className="space-y-6 w-full animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
                  <Download className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Your download is ready!</h3>
                  <p className="text-muted-foreground text-sm mt-2">Thank you for using Vantage MineHub.</p>
                </div>
                <Button className="w-full h-12 text-lg font-bold" onClick={() => {
                  window.open(mod.downloadLink || "https://example.com/download", "_blank");
                  setDownloadModalOpen(false);
                }}>
                  Download File
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
