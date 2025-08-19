import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/prisma";
import axios from "axios";

const TEXTBEE_SIGNING_SECRET = process.env.TEXTBEE_SIGNING_SECRET || "";
const TEXTBEE_API_KEY = process.env.TEXTBEE_API_KEY || "";
const TEXTBEE_DEVICE_ID = process.env.TEXTBEE_DEVICE_ID || "";
const BASE_URL = "https://api.textbee.dev/api/v1";
const MAX_REGISTRATION_ATTEMPTS_PER_DAY = 3;
const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;
const generateProductImage = async (prompt: string) => {
  const fullPrompt = `A photorealistic image of a product, specifically: "${prompt}".`;
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

  const payload = {
    instances: { prompt: fullPrompt },
    parameters: { sampleCount: 1 },
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        "API Error: Failed to generate image.",
        await response.text()
      );
      return null;
    }

    const result: any = await response.json();
    const base64Data = result?.predictions?.[0]?.bytesBase64Encoded;

    if (base64Data) {
      console.log("Image generation successful!");
      return `data:image/png;base64,${base64Data}`;
    }

    console.error("API Error: Response did not contain base64 image data.");
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const verifyTextBeeSignature = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = req.header("X-Signature");
  if (!signature) {
    return res.status(401).send("Missing signature");
  }

  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac("sha256", TEXTBEE_SIGNING_SECRET);
  hmac.update(payload);
  const digest = `sha256=${hmac.digest("hex")}`;

  if (signature !== digest) {
    return res.status(401).send("Invalid signature");
  }

  next();
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendSms = async (recipient: string, message: string) => {
  try {
    await axios.post(
      `${BASE_URL}/gateway/devices/${TEXTBEE_DEVICE_ID}/send-sms`,
      {
        recipients: [recipient],
        message: message,
      },
      {
        headers: {
          "x-api-key": TEXTBEE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`SMS sent successfully to ${recipient}.`);
  } catch (smsError) {
    if ((axios as any).isAxiosError(smsError)) {
      console.error(
        "Error sending SMS:",
        (smsError as any).response
          ? (smsError as any).response.data
          : (smsError as any).message
      );
    } else {
      console.error("Error sending SMS:", smsError);
    }
  }
};

const amharicToArabic = (text: string) => {
  const map: Record<string, string> = {
    "፩": "1",
    "፪": "2",
    "፫": "3",
    "፬": "4",
    "፭": "5",
    "፮": "6",
    "፯": "7",
    "፰": "8",
    "፱": "9",
    "፲": "10",
    "0": "0",
  };
  return text.replace(/[\u1369-\u137B]/g, (char) => map[char] || char);
};

const amharicToEnglish: { [key: string]: string } = {
  ጤፍ: "Teff",
  ስንዴ: "Wheat",
  ሽንኩርት: "Onion",
  ቲማቲም: "Tomato",
  ድንች: "Potato",
  ማር: "Honey",
  ቡና: "Coffee",
  በቆሎ: "Corn",
  ምስር: "Lentils",
  ዳቦ: "Bread",
  "ነጭ ሽንኩርት": "Garlic",
  ባቄላ: "Beans",
};

export const receiveSMS = async (req: Request, res: Response) => {
  console.log("Incoming SMS webhook payload:", req.body);
  const from = req.body.sender;
  const rawText = req.body.message?.trim();
  const amharicHa = "ሀ";

  if (!from || !rawText) {
    return res.status(400).json({ error: "Missing sender or text" });
  }

  const text = amharicToArabic(rawText);

  try {
    let user = await prisma.user.findUnique({ where: { phone: from } });
    if (text.includes(amharicHa)) {
      if (!user) {
        const now = new Date();
        const attemptsToday = await prisma.user.count({
          where: {
            phone: from,
            lastRegistrationAttempt: {
              gte: new Date(now.getTime() - TWENTY_FOUR_HOURS_IN_MS),
            },
          },
        });

        if (attemptsToday >= MAX_REGISTRATION_ATTEMPTS_PER_DAY) {
          await sendSms(from, "እባክዎ በቀን 3 ጊዜ ብቻ ነው ለመመዝገብ መሞከር የሚችሉት።");
          return res.status(200).json({ message: "Rate limit exceeded" });
        }

        user = await prisma.user.create({
          data: {
            phone: from,
            status: "name_account_pending",
            lastRegistrationAttempt: now,
            role: "Farmer",
          },
        });
        await sendSms(
          from,
          'እንኳን ወደ አግሮLink በደህና መጡ። እባክዎ ሙሉ ስምዎን እና የባንክ አካውንት ቁጥርዎን ለምሳሌ "ሙሉ ስም፣ 123456789" ብለው ይላኩ።'
        );
        return res
          .status(200)
          .json({
            message:
              "Registration initiated, waiting for name and account number",
          });
      } else if (user.status === "registered") {
        await sendSms(
          from,
          "እርስዎ ቀድሞውኑ ተመዝግበዋል። ምርት ለመለጠፍ የርስዎ ምርት፣ ብዛት እና ዋጋ ይላኩ።"
        );
        return res.status(200).json({ message: "User already registered" });
      } else {
        await sendSms(
          from,
          "እርስዎ ቀድሞውኑ ወደ መመዝገቢያ ሂደት ገብተዋል። እባክዎ የቀድሞውን መልዕክት ተከትለው ያጠናቁ።"
        );
        return res
          .status(200)
          .json({ message: "User is in a registration flow, cannot restart" });
      }
    }
    if (user && user.status === "name_account_pending") {
      const parts = text.split(/[,，፣]\s*/);
      if (parts.length === 2 && !isNaN(Number(parts[1]))) {
        const name = parts[0];
        const accountNumber = parts[1];
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            name,
            accountNumber,
            otp,
            otpExpiresAt,
            status: "otp_pending",
          },
        });

        await sendSms(from, `የርስዎ ማረጋገጫ ኮድ: ${otp} ነው:: እባክዎ ኮዱን ለምዝገባ ይላኩ።`);
        return res
          .status(200)
          .json({ message: "OTP sent, waiting for verification" });
      } else {
        await sendSms(
          from,
          'ያስገቡት መረጃ ትክክል አይደለም። እባክዎ ሙሉ ስምዎን እና የባንክ አካውንት ቁጥርዎን በትክክለኛው ቅርፅ ይላኩ (ለምሳሌ: "ሙሉ ስም፣ 123456789")።'
        );
        return res
          .status(200)
          .json({ message: "Invalid name/account number format" });
      }
    }
    if (user && user.status === "otp_pending") {
      if (
        text === user.otp &&
        user.otpExpiresAt &&
        user.otpExpiresAt > new Date()
      ) {
        await prisma.user.update({
          where: { id: user.id },
          data: { status: "registered", otp: null, otpExpiresAt: null },
        });
        await sendSms(
          from,
          "በአግሮLink በተሳካ ሁኔታ ተመዝግበዋል! ምርት ለመለጠፍ የርስዎ ምርት፣ ብዛት እና ዋጋ ይላኩ።"
        );
        return res.status(200).json({ message: "Registration complete" });
      } else {
        await sendSms(from, "ያልተገባ ወይም ጊዜው ያለፈበት ኮድ። እባክዎ ኮዱን በድጋሚ ይሞክሩ።");
        return res.status(200).json({ message: "Invalid or expired OTP" });
      }
    }
    if (user && user.status === "registered") {
      console.log("Attempting to parse product message:", text);
      console.log(
        "User message character codes:",
        Array.from(text).map((char) => char.charCodeAt(0))
      );
      const productMatch = text.match(
        /ምርት\s*[:：]?\s*(.+?)\s*[,，፣]\s*ብዛት\s*[:：]?\s*(\d+)\s*ኪ\.ግ\s*[,，፣]\s*ዋጋ\s*[:：]?\s*(\d+)\s*ብር/u
      );

      console.log("Regex match result:", productMatch);

      let name: string | undefined;
      let quantity: number | undefined;
      let price: number | undefined;

      if (productMatch) {
        const [, n, q, p] = productMatch;
        name = n.trim();
        quantity = parseInt(q, 10);
        price = parseFloat(p);
      }

      if (name && quantity && price) {
        const englishName = amharicToEnglish[name] || name;
        const imageUrl = await generateProductImage(englishName);

        const product = await prisma.product.create({
          data: {
            name,
            quantity,
            price,
            imageUrl,
            userId: user.id,
          },
        });

        await sendSms(
          from,
          `ምርት "${product.name}" (ብዛት: ${product.quantity} ኪ.ግ, ዋጋ: ${product.price} ብር) በትክክል ተመዝግቧል።`
        );
        return res
          .status(200)
          .json({ message: "Product added and confirmation sent", product });
      } else {
        await sendSms(
          from,
          'መልዕክትዎ አልገባኝም። ምርት ለመለጠፍ የርስዎ ምርት፣ ብዛት እና ዋጋ ይላኩ። ለምሳሌ: "ምርት: ጤፍ, ብዛት፡ 100ኪ.ግ, ዋጋ ፡10000ብር".'
        );
      }
    }
    return res.status(200).json({ message: "No action needed" });
  } catch (error) {
    console.error("Error processing SMS:", error);
    await sendSms(from, "በመመዝገብዎ ላይ ችግር አጋጥሟል። እባክዎ በኋላ ይሞክሩ።");
    return res.status(500).json({ error: "Server error" });
  }
};
