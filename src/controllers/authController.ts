import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { generateAccessToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    sendError(res, 'An account with this email already exists', 409);
    return;
  }

  const user = await User.create({ firstName, lastName, email, password, phone });
  const token = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  sendSuccess(
    res,
    {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist,
      },
    },
    'Account created successfully',
    201
  );
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, isActive: true }).select('+password');
  if (!user) {
    sendError(res, 'Invalid email or password', 401);
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    sendError(res, 'Invalid email or password', 401);
    return;
  }

  const token = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  sendSuccess(res, {
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      addresses: user.addresses,
      wishlist: user.wishlist,
    },
  }, 'Logged in successfully');
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.userId);
  if (!user) {
    sendError(res, 'User not found', 404);
    return;
  }
  sendSuccess(res, {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    addresses: user.addresses,
    wishlist: user.wishlist.map(id => id.toString()),
  });
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const allowed = ['firstName', 'lastName', 'phone', 'birthday', 'gender'];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const user = await User.findByIdAndUpdate(
    req.user?.userId,
    updates,
    { new: true, runValidators: true }
  );
  if (!user) {
    sendError(res, 'User not found', 404);
    return;
  }
  sendSuccess(res, {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    addresses: user.addresses,
    wishlist: user.wishlist.map(id => id.toString()),
  }, 'Profile updated');
};

export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.userId);
  if (!user) {
    sendError(res, 'User not found', 404);
    return;
  }

  if (req.body.isDefault) {
    user.addresses.forEach(a => { a.isDefault = false; });
  }

  user.addresses.push(req.body);
  await user.save();
  sendSuccess(res, user.addresses, 'Address added', 201);
};

export const removeAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.userId);
  if (!user) {
    sendError(res, 'User not found', 404);
    return;
  }

  user.addresses = user.addresses.filter(
    a => (a as typeof a & { _id: mongoose.Types.ObjectId })._id?.toString() !== req.params.addressId
  ) as typeof user.addresses;

  await user.save();
  sendSuccess(res, user.addresses, 'Address removed');
};

export const toggleWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  const { productId } = req.params;
  const user = await User.findById(req.user?.userId);
  if (!user) {
    sendError(res, 'User not found', 404);
    return;
  }

  const objectId = new mongoose.Types.ObjectId(productId);
  const idx = user.wishlist.findIndex(id => id.toString() === productId);
  let action: string;

  if (idx > -1) {
    user.wishlist.splice(idx, 1);
    action = 'removed from';
  } else {
    user.wishlist.push(objectId);
    action = 'added to';
  }

  await user.save();
  sendSuccess(res, {
    wishlist: user.wishlist.map(id => id.toString()),
  }, `Product ${action} wishlist`);
};
