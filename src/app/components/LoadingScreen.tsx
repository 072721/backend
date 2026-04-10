import { Trophy } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center size-16 bg-black rounded-full mb-4 animate-pulse">
          <Trophy className="size-8 text-white" />
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
