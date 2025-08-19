import express from "express";

const router = express.Router();

import { getAgriculturalAdvice } from "../controllers/advice.controller";

router.post("/", getAgriculturalAdvice);

export default router;
