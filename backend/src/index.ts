import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user";
import { interpretDreamAgent } from "./dreamAgent";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL!, {
      // options if needed, e.g. useNewUrlParser: true
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);


app.post("/api/dream", async (req, res) => {
  try {
    const { userId, userMessage } = req.body;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    if (!userMessage) {
      res.status(400).json({ error: "Dream text is required" });
      return;
    }

    const interpretation = await interpretDreamAgent(userId, userMessage);
    res.json({ interpretation });
  } catch (error) {
    console.error("Error interpreting dream:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
