import { Request, Response } from 'express';
import prisma from '../prisma/prisma';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const generateProductImage = async (prompt: string) => {
  const fullPrompt = `A photorealistic image of a product, specifically: "${prompt}".`;
  console.log(`Attempting to generate image for prompt: ${fullPrompt}`);
  
  const payload = { instances: { prompt: fullPrompt }, parameters: { "sampleCount": 1 } };
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error: Failed to generate image.', errorText);
      return null;
    }

    const result = await response.json();
    if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
      console.log('Image generation successful!');
      const base64Data = result.predictions[0].bytesBase64Encoded;
      return `data:image/png;base64,${base64Data}`;
    }
    
    console.error('API Error: Response did not contain base64 image data.');
    return null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
};

const getUserIdFromToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return (decoded as { userId: string }).userId;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        user: true,
      },
    });
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    return res.status(500).json({ error: 'Server error fetching products.' });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  const { phone } = req.body;

  try {
    if (phone) {
      const { name, quantity } = req.body;
      if (!name || quantity === undefined) {
        return res.status(400).json({ error: 'Missing product name or quantity for text-based request.' });
      }
      const user = await prisma.user.findUnique({ where: { phone } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate a relevant image based on the product name for the text post
      const imageUrl = await generateProductImage(name);
      
      const product = await prisma.product.create({
        data: {
          name,
          quantity,
          imageUrl, // Use the generated image URL
          userId: user.id,
        },
      });
      console.log('Product added to database with imageUrl:', imageUrl);
      return res.status(201).json({ message: 'Product added via SMS', product });
    }
    else {
      // ... (your existing code for image-based posts remains unchanged)
      const userIdFromToken = getUserIdFromToken(req);

      if (!userIdFromToken) {
        return res.status(401).json({ error: 'You must be logged in to post a product.' });
      }

      const { name, quantity, price, description, imageUrl } = req.body;
      if (!name || quantity === undefined || price === undefined || !imageUrl || !description) {
        return res.status(400).json({ error: 'Missing required product fields: name, quantity, price, imageUrl, or description.' });
      }
      const product = await prisma.product.create({
        data: {
          name,
          quantity: parseInt(quantity, 10),
          price: parseFloat(price),
          description,
          imageUrl,
          userId: userIdFromToken,
        },
      });
      return res.status(201).json({ message: 'Product posted with image successfully!', product });
    }
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
