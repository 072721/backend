import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import { router } from './routes';
import './utils/seedDemoData'; // Auto-seed demo data for testing

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}