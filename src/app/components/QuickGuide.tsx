import { useState } from 'react';
import { HelpCircle, X, Trophy, Users, BarChart3, History } from 'lucide-react';
import { Button } from './ui/button';

export function QuickGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 size-14 rounded-full shadow-lg z-40 bg-white"
      >
        <HelpCircle className="size-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Quick Guide</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-2">
                  <Trophy className="size-5 text-blue-600 mt-0.5" />
                  <h3 className="font-semibold text-blue-900">Start a Game</h3>
                </div>
                <p className="text-sm text-blue-700 pl-8">
                  Click "Start New Game" → Enter team names → Add players to each team → Start tracking!
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-2">
                  <BarChart3 className="size-5 text-green-600 mt-0.5" />
                  <h3 className="font-semibold text-green-900">Track Stats</h3>
                </div>
                <p className="text-sm text-green-700 pl-8">
                  Use the + and - buttons to track Points, Rebounds, Assists, and Fouls for each player in real-time.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-2">
                  <Users className="size-5 text-purple-600 mt-0.5" />
                  <h3 className="font-semibold text-purple-900">Manage Players</h3>
                </div>
                <p className="text-sm text-purple-700 pl-8">
                  Add or remove players during setup. The top performer on each team gets a trophy icon!
                </p>
              </div>

              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-2">
                  <History className="size-5 text-orange-600 mt-0.5" />
                  <h3 className="font-semibold text-orange-900">View History</h3>
                </div>
                <p className="text-sm text-orange-700 pl-8">
                  Review past games with full statistics. Expand each game to see detailed player stats.
                </p>
              </div>

              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 italic">
                  "Every play matters. Every stat counts."
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 bg-black hover:bg-gray-800"
            >
              Got it!
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
