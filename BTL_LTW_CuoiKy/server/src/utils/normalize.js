// "Trứng Gà " -> "trung ga" (chữ thường, bỏ dấu, gọn khoảng trắng)
export const normalize = (s = '') =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim()
    .replace(/\s+/g, ' ');

export const slugify = (s) => normalize(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
