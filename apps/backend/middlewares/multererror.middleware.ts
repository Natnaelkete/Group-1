import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

export const multerErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File is too large. Max size is 5MB.",
      });
    }
    return res.status(400).json({
      message: `File upload error: ${err.message}`,
    });
  }

  return res.status(500).json({
    message: "Something went wrong on the server.",
  });
};
