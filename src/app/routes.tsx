import { createBrowserRouter, Navigate } from 'react-router';
import { useAuth } from './context/AuthContext';
import AuthScreen from './screens/AuthScreen';
import GuestModeScreen from './screens/GuestModeScreen';
import DashboardScreen from './screens/DashboardScreen';
import GameSetupScreen from './screens/GameSetupScreen';
import LiveGameScreen from './screens/LiveGameScreen';
import GameHistoryScreen from './screens/GameHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import { isAdminLoggedIn } from './utils/adminStorage';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Guest Route wrapper
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isGuest } = useAuth();
  
  if (!isGuest) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Admin Route wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = isAdminLoggedIn();
  
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
}

// Root redirect logic
function RootRedirect() {
  const { user, isGuest } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (isGuest) {
    return <Navigate to="/guest" replace />;
  }
  
  return <AuthScreen />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootRedirect,
  },
  {
    path: '/guest',
    element: (
      <GuestRoute>
        <GuestModeScreen />
      </GuestRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/game/setup',
    element: (
      <ProtectedRoute>
        <GameSetupScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/game/:gameId',
    element: (
      <ProtectedRoute>
        <LiveGameScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <GameHistoryScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfileScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: <AdminLoginScreen />,
  },
  {
    path: '/admin/dashboard',
    element: (
      <AdminRoute>
        <AdminDashboardScreen />
      </AdminRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);