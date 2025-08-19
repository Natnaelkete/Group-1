import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.route";
import smsRoutes from "./routes/sms.route";
import productRoutes from "./routes/product.route";
import diseasesDetection from "./routes/diseaseDetection.route";
import weatherPredictionRoutes from "./routes/weatherPrediction.Route";
import adviceRoutes from "./routes/advice.route";

import { multerErrorHandler } from "./middlewares/multererror.middleware";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/weather-prediction", weatherPredictionRoutes);
app.use("/api/detect", diseasesDetection);
app.use("/api/advice", adviceRoutes);

app.use(multerErrorHandler);

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});

export default app;
