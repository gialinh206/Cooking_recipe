export const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
export const MEALS = [
  { key: 'breakfast', label: 'Sáng' },
  { key: 'lunch', label: 'Trưa' },
  { key: 'dinner', label: 'Tối' },
];
export const DIFFICULTY = { easy: 'Dễ', medium: 'Vừa', hard: 'Khó' };
export const STATUS = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Bị từ chối' };

export const imgUrl = (p) => p || 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" text-anchor="middle" fill="#9ca3af" font-size="20">Chưa có ảnh</text></svg>'
);

const pad = (n) => String(n).padStart(2, '0');
const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Trả về 'YYYY-MM-DD' của thứ 2 trong tuần chứa ngày d
export const getMonday = (d = new Date()) => {
  const x = new Date(d);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return fmt(x);
};
export const addWeeks = (weekStart, n) => {
  const [y, m, d] = weekStart.split('-').map(Number);
  return fmt(new Date(y, m - 1, d + n * 7));
};
