// controllers/diseaseDetection.controller.ts
import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../prisma/prisma";
import axios from "axios";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const diseaseDetection = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    const imageUrl = req.file.path;
    const mimeType = req.file.mimetype;

    console.log("Uploaded image URL:", imageUrl);

    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const base64String = Buffer.from(imageResponse.data as any).toString(
      "base64"
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
      You are an expert in plant pathology. Analyze this image of a plant leaf or seed.
      Identify any diseases present.
      What is the likely name of the disease?
      What are the primary causes of this disease?
      Provide practical, actionable advice on how to prevent and treat this disease, suitable for a farmer.

      Please format your response as a single, valid JSON object with the following keys:
      {
        "diseaseName": "The disease name",
        "causes": "Description of the causes",
        "treatment": "Practical advice for treatment and prevention"
      }
      Do not include any extra text, markdown formatting, or code fences outside of the JSON object itself.
    `;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: base64String } }, // Use the Base64 string here
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            diseaseName: { type: "STRING" },
            causes: { type: "STRING" },
            treatment: { type: "STRING" },
          },
        },
      },
    };

    const result = await model.generateContent(payload as any);

    const response = await result.response;
    const text = response.text();

    const parsedData = JSON.parse(text);

    const savedAdvice = await prisma.diseaseAdvice.create({
      data: {
        image: imageUrl,
        diseaseName: parsedData.diseaseName,
        causes: parsedData.causes,
        treatment: parsedData.treatment,
      },
    });

    res.status(200).json({ analysis: savedAdvice });
  } catch (error) {
    console.error("Error during disease detection:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

export default diseaseDetection;
