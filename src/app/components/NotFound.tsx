import { useNavigate } from 'react-router';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center size-20 bg-red-100 rounded-full mb-4">
          <AlertCircle className="size-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-gray-600 mb-6">Page not found</p>
        <Button onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
