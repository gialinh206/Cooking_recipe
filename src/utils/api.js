const BASE = 'http://localhost:5000/api';

export const api = async (path, { method = 'GET', body, token } = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Có lỗi xảy ra');
  return data;
};
