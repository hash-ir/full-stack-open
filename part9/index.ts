import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
