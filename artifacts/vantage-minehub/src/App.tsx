import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Welcome from "@/pages/Welcome";
import Auth from "@/pages/Auth";
import Mods from "@/pages/Mods";
import ModDetail from "@/pages/ModDetail";
import Developers from "@/pages/Developers";
import DeveloperProfile from "@/pages/DeveloperProfile";
import Profile from "@/pages/Profile";
import BecomeDeveloper from "@/pages/BecomeDeveloper";
import Announcements from "@/pages/Announcements";
import DeveloperPending from "@/pages/DeveloperPending";
import Dashboard from "@/pages/dashboard/Dashboard";
import UploadMod from "@/pages/dashboard/Upload";
import MyUploads from "@/pages/dashboard/MyUploads";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminMods from "@/pages/admin/AdminMods";
import AdminDevelopers from "@/pages/admin/AdminDevelopers";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminAnnouncements from "@/pages/admin/AdminAnnouncements";
import AdminSettings from "@/pages/admin/AdminSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/auth" component={Auth} />
      <Route path="/mods" component={Mods} />
      <Route path="/mods/:id" component={ModDetail} />
      <Route path="/developers" component={Developers} />
      <Route path="/developers/:id" component={DeveloperProfile} />
      <Route path="/announcements" component={Announcements} />
      
      {/* User Routes */}
      <Route path="/profile" component={Profile} />
      <Route path="/become-developer" component={BecomeDeveloper} />
      <Route path="/developer-pending" component={DeveloperPending} />
      
      {/* Developer Dashboard Routes */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/upload" component={UploadMod} />
      <Route path="/dashboard/my-uploads" component={MyUploads} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/mods" component={AdminMods} />
      <Route path="/admin/developers" component={AdminDevelopers} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/announcements" component={AdminAnnouncements} />
      <Route path="/admin/settings" component={AdminSettings} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AdminProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
