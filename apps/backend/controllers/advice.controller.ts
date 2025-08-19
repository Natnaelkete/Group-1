import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../prisma/prisma";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY as string);

export const getAgriculturalAdvice = async (req: Request, res: Response) => {
  const { crop, region, problem, userId } = req.body;
  if (!crop || !region || !problem || !userId) {
    return res.status(400).json({
      message: "Missing required parameters: crop, region, problem, or userId.",
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an experienced agricultural advisor for farmers in Ethiopia.
      Provide practical, culturally-appropriate, and actionable advice for a farmer in the ${region} region.
      The farmer is growing ${crop} and is currently facing the following problem: ${problem}.
      The advice should be specific to the climate and farming practices of Ethiopia.
      Please format the response as a clear, easy-to-read paragraph.
      Do not include any greetings or closings. Just provide the advice.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const adviceRecord = await prisma.advice.create({
      data: {
        crop,
        region,
        problem,
        advice: text,
        userId: userId,
      },
    });
    return res.status(200).json(adviceRecord);
  } catch (error) {
    console.error(
      "Error fetching advice from Gemini API or saving to database:",
      error
    );
    return res.status(500).json({
      message: "An error occurred. Please try again later.",
    });
  }
};
