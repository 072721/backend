import express from "express";
import admin from "firebase-admin";
import { db } from "../lib/firebase"; // Make sure your firebase.ts exports 'db'
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.use(requireAuth);

// 1. Create a Game
router.post("/", async (req: AuthRequest, res) => {
  const { homeTeam, awayTeam, teamA, teamB, status, players, stats, finishedAt } = req.body;
  if (!homeTeam || !awayTeam) return res.status(400).json({ message: "Missing teams" });

  try {
    const newGame: any = {
      homeTeam,
      awayTeam,
      ownerId: req.userId!,
      homeScore: 0,
      awayScore: 0,
      status: status || "live",
      events: [],
      createdAt: new Date().toISOString(),
      players: players || [],
      stats: stats || [],
      finishedAt: finishedAt || null,
    };

    // Include team data if provided
    if (teamA) newGame.teamA = teamA;
    if (teamB) newGame.teamB = teamB;

    const docRef = await db.collection("games").add(newGame);
    res.json({ id: docRef.id, ...newGame });
  } catch (error) {
    res.status(500).json({ message: "Error creating game" });
  }
});

// 2. Get All User's Games
router.get("/", async (req: AuthRequest, res) => {
  try {
    const snapshot = await db.collection("games")
      .where("ownerId", "==", req.userId!)
      .get();
    
    const games = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: "Error fetching games" });
  }
});

// 3. Get Single Game
router.get("/:id", async (req: AuthRequest, res) => {
  const id = req.params.id; // Firestore IDs are strings
  const doc = await db.collection("games").doc(id).get();

  if (!doc.exists || doc.data()?.ownerId !== req.userId) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({ id: doc.id, ...doc.data() });
});

// 4. Update Game (Score/Status)
router.put("/:id", async (req: AuthRequest, res) => {
  const id = req.params.id;
  const { homeScore, awayScore, status, players, stats, teamA, teamB, finishedAt } = req.body;
  const docRef = db.collection("games").doc(id);
  const doc = await docRef.get();

  if (!doc.exists || doc.data()?.ownerId !== req.userId) {
    return res.status(404).json({ message: "Not found" });
  }

  try {
    const updateData: any = {};
    if (homeScore !== undefined) updateData.homeScore = Number(homeScore);
    if (awayScore !== undefined) updateData.awayScore = Number(awayScore);
    if (status) updateData.status = status;
    if (teamA) updateData.teamA = teamA;
    if (teamB) updateData.teamB = teamB;
    if (players) updateData.players = players;
    if (stats) updateData.stats = stats;
    if (finishedAt) updateData.finishedAt = finishedAt;

    await docRef.update(updateData);
    res.json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

// 5. Add Game Event (Point, Foul, etc.)
router.post("/:id/events", async (req: AuthRequest, res) => {
  const id = req.params.id;
  const { type, team, player, points } = req.body;
  
  if (!type || !team || !player) return res.status(400).json({ message: "Missing fields" });

  const docRef = db.collection("games").doc(id);
  const doc = await docRef.get();

  if (!doc.exists || doc.data()?.ownerId !== req.userId) {
    return res.status(404).json({ message: "Not found" });
  }

  const data = doc.data()!;
  const newEvent = {
    type,
    team,
    player,
    points: Number(points),
    at: new Date().toISOString()
  };

  // Calculate new scores
  const newHomeScore = data.homeScore + (team === "HOME" ? Number(points) : 0);
  const newAwayScore = data.awayScore + (team === "AWAY" ? Number(points) : 0);

  // Use arrayUnion to safely add to the events list in Firestore
  await docRef.update({
    events: admin.firestore.FieldValue.arrayUnion(newEvent),
    homeScore: newHomeScore,
    awayScore: newAwayScore
  });

  res.json({ message: "Event added", homeScore: newHomeScore, awayScore: newAwayScore });
});

// 6. Delete Game
router.delete("/:id", async (req: AuthRequest, res) => {
  const id = req.params.id;
  const docRef = db.collection("games").doc(id);
  const doc = await docRef.get();

  if (!doc.exists || doc.data()?.ownerId !== req.userId) {
    return res.status(404).json({ message: "Not found" });
  }

  try {
    await docRef.delete();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;