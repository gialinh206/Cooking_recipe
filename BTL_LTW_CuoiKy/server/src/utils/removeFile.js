import fs from 'fs/promises';
import path from 'path';

const dir = path.resolve('uploads');

// Xóa file ảnh đã upload từ đường dẫn lưu trong DB (dạng '/uploads/ten-file.jpg').
// Chỉ xóa trong thư mục uploads; file không còn thì bỏ qua.
export const removeUploadedFile = async (url) => {
  if (!url || !String(url).startsWith('/uploads/')) return;
  try {
    await fs.unlink(path.join(dir, path.basename(url)));
  } catch {
    /* file đã mất hoặc không xóa được: không làm hỏng request */
  }
};