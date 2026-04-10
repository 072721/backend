import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../lib/firebase"; // Use our Firebase connection
import { signToken } from "../lib/jwt";

const router = express.Router();

// 1. Register User
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ message: "Missing fields" });

  try {
    // Check if user exists in Firestore
    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", email).get();

    if (!snapshot.empty) return res.status(400).json({ message: "Email exists" });

    const hash = await bcrypt.hash(password, 10);
    
    const newUser = {
      email,
      name,
      password: hash,
      createdAt: new Date().toISOString()
    };

    // Add to Firestore
    const docRef = await userRef.add(newUser);

    const token = signToken({ userId: docRef.id });
    res.json({
      user: { id: docRef.id, email, name },
      token
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
});

// 2. Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  try {
    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", email).limit(1).get();

    if (snapshot.empty) return res.status(401).json({ message: "Invalid credentials" });

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ userId: userDoc.id });
    res.json({
      user: { id: userDoc.id, email: user.email, name: user.name },
      token
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Login failed" });
  }
});

export default router;