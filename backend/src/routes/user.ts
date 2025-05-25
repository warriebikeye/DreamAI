// src/routes/user.ts
import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { username } = req.body;

  if (!username) {
    res.status(400).json({ error: "Username is required" });
    return;
  }

  try {
    // Check if username already exists
    let user = await User.findOne({ username });

    if (!user) {
      // Create new user with generated UUID
      user = new User({ username, userId: uuidv4() });
      await user.save();
    }

    // Return existing or new userId
    res.json({ userId: user.userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
