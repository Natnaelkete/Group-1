import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../prisma/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_APY_KEY as string);

const diseaseDetection = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    const imageUrl = req.file.path;

    console.log("Uploaded image URL:", imageUrl);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // const prompt2 = `
    //     You are an expert in agriculture and botany. Analyze the provided image of a plant.
    //     Identify any potential diseases, pests, or nutritional deficiencies.
    //     Provide a detailed explanation of the issue, suggest possible remedies, and offer advice on prevention.
    //     Only respond with information relevant to the image provided.
    // `;

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
