import { Router } from 'express';
import {
  register,
  login,
  registerAndSendOtp,
  verifyAndCompleteRegistration,
  loginAndSendOtp, 
  verifyLoginOtp 
} from '../controllers/auth.controller';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/register-with-otp', registerAndSendOtp);
router.post('/verify-registration-otp', verifyAndCompleteRegistration);
router.post('/login-with-otp', loginAndSendOtp);
router.post('/verify-login-otp', verifyLoginOtp);

export default router;
