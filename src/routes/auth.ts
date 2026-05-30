import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, updateProfile, addAddress, removeAddress, toggleWishlist } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateProfile);
router.post('/me/addresses', authenticate, addAddress);
router.delete('/me/addresses/:addressId', authenticate, removeAddress);
router.post('/me/wishlist/:productId', authenticate, toggleWishlist);

export default router;
