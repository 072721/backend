import { useState, useEffect } from 'react';
import { Trophy, X } from 'lucide-react';
import { Button } from './ui/button';

export function WelcomeModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('basketball_welcome_seen');
    if (!hasSeenWelcome) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('basketball_welcome_seen', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="size-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center size-16 bg-black rounded-full mb-4">
            <Trophy className="size-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Basketball Tracker!</h2>
          <p className="text-gray-600">
            Track every play, record every stat, and relive every game.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="size-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-sm">Live Game Tracking</p>
              <p className="text-xs text-gray-600">Track points, rebounds, assists, and fouls in real-time</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <div className="size-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-sm">Game History</p>
              <p className="text-xs text-gray-600">Review and analyze past games anytime</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="size-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-sm">Player Stats</p>
              <p className="text-xs text-gray-600">Comprehensive statistics for every player</p>
            </div>
          </div>
        </div>

        <Button onClick={handleClose} className="w-full bg-black hover:bg-gray-800">
          Get Started
        </Button>

        <p className="text-center text-xs text-gray-500 mt-4 italic">
          "Every play matters. Every stat counts."
        </p>
      </div>
    </div>
  );
}
