import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { createGameFirestore } from "../firestoreService";
import { Button } from "../components/ui/button";
import { Game } from "../types";

export default function GameSetupScreen() {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const onCreateGame = async () => {
    if (!user) return setError("Login required");
    if (!teamA || !teamB) return setError("Input both teams");

    try {
      const created = await createGameFirestore(user.id, {
        id: "A",
        name: teamA,
        color: "#2563eb"
      }, {
        id: "B",
        name: teamB,
        color: "#dc2626"
      });

      navigate(`/game/${created.id}`);
    } catch (e) {
      console.error(e);
      setError("Create game failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">New Game</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Home Team
            </label>
            <input
              type="text"
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              placeholder="Enter home team name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Away Team
            </label>
            <input
              type="text"
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              placeholder="Enter away team name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <Button
            onClick={onCreateGame}
            className="w-full mt-6"
            size="lg"
            disabled={!teamA || !teamB}
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
}