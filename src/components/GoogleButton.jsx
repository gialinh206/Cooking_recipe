import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

// Nút "Đăng nhập với Google"; onSuccess chạy sau khi server đã cấp JWT
const GoogleButton = ({ onSuccess }) => {
  const { signInWithGoogle } = useAuth();

  const handleSuccess = async ({ credential }) => {
    try {
      await signInWithGoogle(credential);
      onSuccess?.();
    } catch {
      /* lỗi hiển thị qua state.auth.error */
    }
  };

  return (
    <div className="mt-6">
      <p className="mb-3 text-center text-sm text-gray-500">hoặc</p>
      <div className="flex justify-center">
        <GoogleLogin onSuccess={handleSuccess} onError={() => {}} text="signin_with" />
      </div>
    </div>
  );
};

export default GoogleButton;
