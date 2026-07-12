import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { CurrencyProvider } from '@/lib/CurrencyContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ThemeProvider } from '@/lib/ThemeContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import { LocationProvider } from '@/lib/LocationContext';
import ScrollToTop from './components/ScrollToTop';
import BottomNav from '@/components/explore/BottomNav';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Page imports
import Home from '@/pages/Home';
import Explore from '@/pages/Explore';
import AiPlanner from '@/pages/AiPlanner';
import Safety from '@/pages/Safety';
import Profile from '@/pages/Profile';
import AccessibilityPage from '@/pages/AccessibilityPage';
import HeritageScanner from '@/pages/HeritageScanner';
import SearchPage from '@/pages/Search';
import SavedItineraries from '@/pages/SavedItineraries';
import FavoriteDestinations from '@/pages/FavoriteDestinations';
import SettingsNotifications from '@/pages/SettingsNotifications';
import SettingsLanguage from '@/pages/SettingsLanguage';
import SettingsAccount from '@/pages/SettingsAccount';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <LocationProvider>
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/" element={<><Home /><BottomNav /></>} />
          <Route path="/explore" element={<><Explore /><BottomNav /></>} />
          <Route path="/search" element={<><SearchPage /><BottomNav /></>} />
          <Route path="/scan" element={<><HeritageScanner /><BottomNav /></>} />
          <Route path="/planner" element={<><AiPlanner /><BottomNav /></>} />
          <Route path="/safety" element={<><Safety /><BottomNav /></>} />
          <Route path="/profile" element={<><Profile /><BottomNav /></>} />
          <Route path="/accessibility" element={<><AccessibilityPage /><BottomNav /></>} />
          <Route path="/saved-itineraries" element={<><SavedItineraries /><BottomNav /></>} />
          <Route path="/favorite-destinations" element={<><FavoriteDestinations /><BottomNav /></>} />
          <Route path="/settings/notifications" element={<><SettingsNotifications /><BottomNav /></>} />
          <Route path="/settings/language" element={<><SettingsLanguage /><BottomNav /></>} />
          <Route path="/settings/account" element={<><SettingsAccount /><BottomNav /></>} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AnimatePresence>
    </LocationProvider>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#08111F]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          <span className="text-white/30 text-sm font-medium">Loading ExploreAR...</span>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return <AnimatedRoutes />;
};

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <ThemeProvider>
          <LanguageProvider>
            <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
            </QueryClientProvider>
          </LanguageProvider>
        </ThemeProvider>
      </CurrencyProvider>
    </AuthProvider>
  )
}

export default App