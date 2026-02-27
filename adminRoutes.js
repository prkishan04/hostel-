import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  getAllComplaints,
  updateComplaintStatus
} from '../models/complaintModel.js';

const router = express.Router();

// DevOps: admin routes require both authentication and admin role check.
router.use(authenticateToken, requireAdmin);

// List complaints with optional filters
router.get('/complaints', async (req, res) => {
  const { category, status } = req.query;
  try {
    const complaints = await getAllComplaints({ category, status });
    return res.json(complaints);
  } catch (err) {
    console.error('Error listing complaints', err);
    return res.status(500).json({ message: 'Internal error' });
  }
});

// Update complaint status
router.patch('/complaints/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  try {
    const updated = await updateComplaintStatus(id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    return res.json(updated);
  } catch (err) {
    console.error('Error updating complaint status', err);
    return res.status(500).json({ message: 'Internal error' });
  }
});

export default router;

