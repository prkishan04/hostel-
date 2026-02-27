import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { createUser, verifyUserCredentials } from '../models/userModel.js';

const router = express.Router();

// Student registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const user = await createUser({ name, email, password });
    return res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already registered' });
    }
    console.error('Error registering user', err);
    return res.status(500).json({ message: 'Internal error' });
  }
});

// Login (student or admin)
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const user = await verifyUserCredentials(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '8h' }
    );

    return res.json({ token, user });
  } catch (err) {
    console.error('Error logging in', err);
    return res.status(500).json({ message: 'Internal error' });
  }
});

export default router;

