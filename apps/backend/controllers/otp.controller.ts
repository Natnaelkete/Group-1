import { Request, Response } from 'express';
import prisma from '../prisma/prisma';
import axios from 'axios';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'agromerce_secret';
const TEXTBEE_API_KEY = process.env.TEXTBEE_API_KEY || '';
const TEXTBEE_DEVICE_ID = process.env.TEXTBEE_DEVICE_ID || '';
const BASE_URL = 'https://api.textbee.dev/api/v1';

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Generated OTP: ${otp}`);
  return otp;
};

const sendTextBeeSMS = async (recipient: string, message: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/gateway/devices/${TEXTBEE_DEVICE_ID}/send-sms`,
      {
        recipients: [recipient],
        message: message,
      },
      {
        headers: {
          'x-api-key': TEXTBEE_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`SMS sent to ${recipient}: ${message}`);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error sending SMS via TextBee:', error.response ? error.response.data : error.message);
    } else {
      console.error('Unknown error sending SMS via TextBee:', error);
    }
    return false;
  }
};

/**
 * @route POST /api/auth/request-otp
 * @description Sends an OTP to the user's phone number.
 */
export const requestOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  try {
    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          name: 'New User (OTP Registered)',
          role: 'Farmer',
          password: null,
        },
      });
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiresAt },
    });

    const smsSent = await sendTextBeeSMS(phone, `Agrolink Verification Code: ${otp}. Do not share this code.`);

    if (smsSent) {
      return res.status(200).json({ message: 'OTP sent successfully.' });
    } else {
      return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }
  } catch (error) {
    console.error('Error requesting OTP:', error);
    return res.status(500).json({ error: 'Server error during OTP request.' });
  }
};

/**
 * @route POST /api/auth/verify-otp
 * @description Verifies the provided OTP and logs the user in.
 */
export const verifyOtp = async (req: Request, res: Response) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { otp: null, otpExpiresAt: null },
        });
      }
      return res.status(401).json({ error: 'Invalid or expired OTP.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiresAt: null },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ message: 'OTP verified successfully.', token, role: user.role });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ error: 'Server error during OTP verification.' });
  }
};

/**
 * @route POST /api/auth/resend-otp
 * @description Resends a new OTP to the user's phone number.
 */
export const resendOtp = async (req: Request, res: Response) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { phone } });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); 

        await prisma.user.update({
            where: { id: user.id },
            data: { otp, otpExpiresAt },
        });

        const smsSent = await sendTextBeeSMS(phone, `Agrolink Verification Code: ${otp}. Do not share this code.`);

        if (smsSent) {
            return res.status(200).json({ message: 'New OTP sent successfully.' });
        } else {
            return res.status(500).json({ error: 'Failed to resend OTP. Please try again.' });
        }
    } catch (error) {
        console.error('Error resending OTP:', error);
        return res.status(500).json({ error: 'Server error during OTP resend.' });
    }
};
