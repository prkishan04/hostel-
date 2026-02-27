import { pool } from '../config/db.js';

// Encapsulate complaint CRUD operations.

export async function createComplaint({ studentId, category, description, priority }) {
  const result = await pool.query(
    `INSERT INTO complaints (student_id, category, description, priority)
     VALUES ($1, $2, $3, $4)
     RETURNING id, student_id, category, description, priority, status, created_at, updated_at`,
    [studentId, category, description, priority]
  );
  return result.rows[0];
}

export async function getComplaintsByStudent(studentId) {
  const result = await pool.query(
    `SELECT id, category, description, priority, status, created_at, updated_at
     FROM complaints WHERE student_id = $1
     ORDER BY created_at DESC`,
    [studentId]
  );
  return result.rows;
}

export async function getAllComplaints({ category, status }) {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (category) {
    conditions.push(`category = $${idx++}`);
    params.push(category);
  }
  if (status) {
    conditions.push(`status = $${idx++}`);
    params.push(status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await pool.query(
    `SELECT c.id, c.category, c.description, c.priority, c.status,
            c.created_at, c.updated_at,
            u.name AS student_name, u.email AS student_email
     FROM complaints c
     JOIN users u ON u.id = c.student_id
     ${whereClause}
     ORDER BY c.created_at DESC`,
    params
  );
  return result.rows;
}

export async function updateComplaintStatus(id, status) {
  const result = await pool.query(
    `UPDATE complaints
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, student_id, category, description, priority, status, created_at, updated_at`,
    [status, id]
  );
  return result.rows[0] || null;
}

