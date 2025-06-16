import express from "express";
import dotenv from "dotenv";
import { calculateBmi } from "./bmiCalculator";

const app = express();
dotenv.config();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const heightParam = req.query.height as string;
  const weightParam = req.query.weight as string;
  const errors: string[] = [];

  if (!heightParam) errors.push("height is required");
  if (!weightParam) errors.push("weight is required");

  // return early if parameters are missing
  if (errors.length > 0) {
    console.error("Missing parameters:", errors.join(", "));
    res.send({ error: `malformatted parameters: ${errors.join(", ")}` });
    return;
  }

  // check for valid numbers
  const height: number = Number(heightParam);
  const weight: number = Number(weightParam);

  if (isNaN(height)) {
    errors.push(`height '${heightParam}' is not a valid number`);
  }

  if (isNaN(weight)) {
    errors.push(`weight '${weightParam}' is not a valid number`);
  }

  if (errors.length > 0) {
    console.error("Invalid parameters:", errors.join(", "));
    res.send({ error: `malformatted parameters: ${errors.join(", ")}` });
    return;
  }

  const bmi = calculateBmi(height, weight);
  res.send({
    weight,
    height,
    bmi,
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
