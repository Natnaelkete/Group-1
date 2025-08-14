// routes/diseaseDetection.route.ts
import { Router } from "express";
import multer from "multer";
import { storageArolink } from "../config/cloudinary";
import diseaseDetection from "../controllers/diseaseDetection.controller";

const router = Router();

const upload = multer({
  storage: storageArolink,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", upload.single("image"), diseaseDetection);

export default router;
