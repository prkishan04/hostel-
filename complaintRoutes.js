import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  createComplaint,
  getComplaintsByStudent
} from '../models/complaintModel.js';

const router = express.Router();

// DevOps: protect all complaint routes behind auth middleware.
router.use(authenticateToken);

// Submit complaint
router.post('/', async (req, res) => {
  const { category, description, priority } = req.body || {};
  if (!category || !description || !priority) {
    return res.status(400).json({ message: 'Category, description, and priority are required' });
  }

  try {
    const complaint = await createComplaint({
      studentId: req.user.id,
      category,
      description,
      priority
    });
    return res.status(201).json(complaint);
  } catch (err) {
    console.error('Error creating complaint', err);
    return res.status(500).json({ message: 'Internal error' });
  }
});

// View complaints for logged-in student
router.get('/', async (req, res) => {
  try {
    const complaints = await getComplaintsByStudent(req.user.id);
    return res.json(complaints);
  } catch (err) {
    console.error('Error fetching complaints', err);
    return res.status(500).json({ message: 'Internal error' });
  }
});

export default router;

