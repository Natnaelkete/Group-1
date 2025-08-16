import { Router } from "express";
import { getWeatherAndCropAdvice } from "../controllers/weatherPrediction.controller";

const router = Router();

router.post("/", getWeatherAndCropAdvice);

export default router;
