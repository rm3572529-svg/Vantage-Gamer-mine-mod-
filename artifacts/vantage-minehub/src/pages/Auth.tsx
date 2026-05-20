import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield, Smartphone, Mail, AlertTriangle, ArrowRight, User } from "lucide-react";
import { SiGoogle } from "react-icons/si";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the Terms & Conditions",
  }),
});

export default function Auth() {
  const [, setLocation] = useLocation();
  const { login, loginWithGoogle, loginWithPhone, loginAsGuest } = useAuth();
  const { toast } = useToast();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'options' | 'email' | 'phone'>('options');

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      termsAccepted: false,
    },
  });

  const onSubmitEmail = (values: z.infer<typeof loginSchema>) => {
    login(values.email, values.password);
    toast({ title: "Logged in successfully" });
    setLocation("/");
  };

  const handleGoogleLogin = () => {
    if (!form.getValues().termsAccepted) {
      form.trigger("termsAccepted");
      return;
    }
    loginWithGoogle();
    toast({ title: "Logged in with Google" });
    setLocation("/");
  };

  const handleGuestLogin = () => {
    if (!form.getValues().termsAccepted) {
      form.trigger("termsAccepted");
      return;
    }
    loginAsGuest();
    toast({ title: "Continuing as Guest" });
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative p-4">
      <div className="w-full max-w-md bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Login to Vantage</h1>
            <p className="text-sm text-muted-foreground mt-1">Access mods, tools, and community</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitEmail)} className="space-y-6">
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border/40 p-4 bg-background/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                      I accept the{" "}
                      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
                        <DialogTrigger asChild>
                          <span className="text-primary hover:underline">Terms & Conditions</span>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Terms & Conditions</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 text-sm text-muted-foreground max-h-[60vh] overflow-y-auto pr-4 py-4">
                            <div className="flex items-center gap-2 text-destructive font-semibold">
                              <AlertTriangle className="h-5 w-5" />
                              <span>Copyright Warning & Scam Alert</span>
                            </div>
                            <p>
                              Vantage Gamer MineHub is a community platform. We do not own Minecraft or its assets. 
                              All content is uploaded by community developers.
                            </p>
                            <p className="font-semibold text-foreground">
                              Virus & APK Disclaimer
                            </p>
                            <p>
                              While we try to moderate content, we cannot guarantee that every uploaded file is 100% safe. 
                              Download and install APKs at your own risk. The developer and Vantage Army are not responsible 
                              for any damage to your device, data loss, or banned accounts.
                            </p>
                            <p>
                              By using this platform, you agree to these terms and assume full responsibility.
                            </p>
                          </div>
                          <DialogFooter>
                            <Button type="button" onClick={() => { field.onChange(true); setIsTermsOpen(false); }}>
                              I Agree
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {activeTab === 'options' && (
              <div className="space-y-3">
                <Button type="button" variant="outline" className="w-full h-12 relative" onClick={handleGoogleLogin}>
                  <SiGoogle className="absolute left-4 w-5 h-5 text-muted-foreground" />
                  Continue with Google
                </Button>
                <Button type="button" variant="outline" className="w-full h-12 relative" onClick={() => setActiveTab('phone')}>
                  <Smartphone className="absolute left-4 w-5 h-5 text-muted-foreground" />
                  Continue with Phone
                </Button>
                <Button type="button" variant="outline" className="w-full h-12 relative" onClick={() => setActiveTab('email')}>
                  <Mail className="absolute left-4 w-5 h-5 text-muted-foreground" />
                  Continue with Email
                </Button>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/40" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                <Button type="button" variant="secondary" className="w-full h-12 relative" onClick={handleGuestLogin}>
                  <User className="absolute left-4 w-5 h-5 text-muted-foreground" />
                  Continue as Guest
                </Button>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setActiveTab('options')}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Sign In
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'phone' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-2">
                  <FormLabel>Phone Number</FormLabel>
                  <Input placeholder="+1 (555) 000-0000" className="bg-background/50" />
                  <p className="text-xs text-muted-foreground">We'll send you an OTP to verify.</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setActiveTab('options')}>
                    Back
                  </Button>
                  <Button type="button" className="flex-1" onClick={() => {
                    if (!form.getValues().termsAccepted) {
                      form.trigger("termsAccepted");
                      return;
                    }
                    loginWithPhone("+15550000000");
                    toast({ title: "Logged in via Phone" });
                    setLocation("/");
                  }}>
                    Send OTP
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
