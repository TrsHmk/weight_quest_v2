import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import LogEntry from '@/pages/LogEntry';
import Achievements from '@/pages/Achievements';
import Journal from '@/pages/Journal';
import Profile from '@/pages/Profile';
import Inventory from '@/pages/Inventory';
import Quests from '@/pages/Quests';
import Stats from '@/pages/Stats';
import Login from '@/pages/Login';
import Onboarding from '@/pages/Onboarding';
import { base44 } from '@/api/base44Client';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, isAuthenticated } = useAuth();

  const { data: profiles = [], isLoading: isLoadingProfile } = useQuery({
    queryKey: ["player-profile"],
    queryFn: () => base44.entities.PlayerProfile.list(),
    enabled: isAuthenticated && !authError,
  });

  // Show loading spinner while checking auth
  if (isLoadingPublicSettings || isLoadingAuth || (isAuthenticated && isLoadingProfile)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  // Show onboarding if user has no profile yet
  if (profiles.length === 0) {
    return <Onboarding />;
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/log" element={<LogEntry />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/quests" element={<Quests />} />
        <Route path="/stats" element={<Stats />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<AuthenticatedApp />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
