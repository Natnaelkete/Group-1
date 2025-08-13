import prisma from '../prisma/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'agromerce_secret';
const TEXTBEE_API_KEY = process.env.TEXTBEE_API_KEY || '';
const TEXTBEE_DEVICE_ID = process.env.TEXTBEE_DEVICE_ID || '';
const BASE_URL = 'https://api.textbee.dev/api/v1';
const registrationData = new Map<string, any>();
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendTextBeeSMS = async (recipient: string, message: string) => {
  try {
    await axios.post(
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
 * @route POST /api/auth/register
 * @description Original registration endpoint
 */
export const register = async (req: Request, res: Response) => {
  const { name, phone, email, password, role } = req.body;
  if (!name || !phone || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const conditions: any[] = [{ phone }];
    if (email) conditions.push({ email });

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: conditions
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * @route POST /api/auth/login
 * @description User login with phone and password
 */
export const login = async (req: Request, res: Response) => {
  const { phone, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { phone }
    });

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // CRITICAL FIX: Change 'id' to 'userId' to match the products.controller
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * @route POST /api/auth/register-with-otp
 * @description Collects registration data, sends an OTP, and stores data temporarily.
 */
export const registerAndSendOtp = async (req: Request, res: Response) => {
    const { name, phone, email, password, role } = req.body;
    if (!name || !phone || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ phone }, { email }] }
      });
  
      if (existingUser) {
        return res.status(400).json({ error: 'User with this phone or email already exists' });
      }
  
      const otp = generateOTP();
      const hashedPassword = await bcrypt.hash(password, 10);
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); 
      registrationData.set(phone, {
        name,
        email,
        password: hashedPassword,
        role,
        otp,
        otpExpiresAt,
      });
  
      const smsSent = await sendTextBeeSMS(phone, `Agrolink Verification Code: ${otp}. Do not share this code.`);
  
      if (smsSent) {
        return res.status(200).json({ message: 'OTP sent successfully. Please verify to complete registration.' });
      } else {
        registrationData.delete(phone); 
        return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
      }
    } catch (error) {
      console.error('Error during OTP registration:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  };
  
  /**
   * @route POST /api/auth/verify-registration-otp
   * @description Verifies OTP and completes the user registration.
   */
  export const verifyAndCompleteRegistration = async (req: Request, res: Response) => {
    const { phone, otp } = req.body;
  
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required.' });
    }
  
    const storedData = registrationData.get(phone);
  
    if (!storedData || storedData.otp !== otp || storedData.otpExpiresAt < new Date()) {
      registrationData.delete(phone); 
      return res.status(401).json({ error: 'Invalid or expired OTP.' });
    }
  
    try {
      const user = await prisma.user.create({
        data: {
          phone,
          name: storedData.name,
          email: storedData.email,
          password: storedData.password,
          role: storedData.role,
        },
      });
      registrationData.delete(phone);
      // CRITICAL FIX: Change 'id' to 'userId' to match the products.controller
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  
      return res.status(200).json({ message: 'Registration complete.', token, role: user.role });
    } catch (error) {
      console.error('Error completing registration:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  };

/**
 * @route POST /api/auth/login-with-otp
 * @description Sends an OTP to an existing user for login.
 */
export const loginAndSendOtp = async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiresAt },
    });

    const smsSent = await sendTextBeeSMS(phone, `Agrolink Login Code: ${otp}. Do not share this code.`);

    if (smsSent) {
      return res.status(200).json({ message: 'OTP sent successfully. Please verify to log in.' });
    } else {
      return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }
  } catch (error) {
    console.error('Error during OTP login request:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * @route POST /api/auth/verify-login-otp
 * @description Verifies OTP for login and returns a JWT token.
 */
export const verifyLoginOtp = async (req: Request, res: Response) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { phone },
    });

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
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ message: 'Login successful.', token, role: user.role });
  } catch (error) {
    console.error('Error during OTP login verification:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
