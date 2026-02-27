// DevOps: backend is exposed as /api behind Nginx, so we use a relative base URL.
const API_BASE = '/api';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { message: text || 'Request failed' };
    }
    throw new Error(json.message || 'Request failed');
  }

  if (res.status === 204) return null;
  return res.json();
}

