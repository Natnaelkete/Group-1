// routes/diseaseDetection.route.ts
import { Router } from "express";
import multer from "multer";
import { storageArolink } from "../config/cloudinary";
import diseaseDetection from "../controllers/diseaseDetection.controller";

const router = Router();

const upload = multer({
  storage: storageArolink,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

router.post(
  "/",
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        console.log("Multer Error:", err);
        return next(err);
      }
      console.log("File uploaded:", req.file);
      next();
    });
  },
  diseaseDetection
);

export default router;
