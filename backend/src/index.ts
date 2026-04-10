import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import gamesRoutes from "./routes/games";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5175",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS policy does not allow access from origin ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal error" });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log("Backend running on", PORT));