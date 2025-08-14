import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("YOUR_API_KEY");

const diseaseDetection = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    const imageUrl = req.file.path;

    console.log("Uploaded image URL:", imageUrl);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const prompt = `
        You are an expert in agriculture and botany. Analyze the provided image of a plant. 
        Identify any potential diseases, pests, or nutritional deficiencies.
        Provide a detailed explanation of the issue, suggest possible remedies, and offer advice on prevention.
        Only respond with information relevant to the image provided.
    `;

    const result = await model.generateContent([
      prompt,
      {
        fileData: {
          mimeType: req.file.mimetype,
          fileUri: imageUrl,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    res.status(200).json({ analysis: text });
  } catch (error) {
    console.error("Error during disease detection:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export default diseaseDetection;
