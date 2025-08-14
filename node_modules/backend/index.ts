import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer, { MulterError } from "multer";

import authRoutes from "./routes/auth.route";
import smsRoutes from "./routes/sms.route";
import productRoutes from "./routes/product.route";
import diseasesDetection from "./routes/diseaseDetection.route";
import weatherPredictionRoutes from "./routes/weatherPrediction.Route";

dotenv.config();
const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/weather-prediction", weatherPredictionRoutes);
app.use("/api/detect", diseasesDetection);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the full error for debugging on the server

  // Check if the error is a MulterError
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File is too large. Max size is 5MB.",
      });
    }
    // Handle other Multer errors
    return res.status(400).json({
      message: `File upload error: ${err.message}`,
    });
  }

  // Handle a generic server error
  return res.status(500).json({
    message: "Something went wrong on the server.",
  });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});

export default app;
