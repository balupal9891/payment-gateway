import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import apiClient from "../../API/apiClient";
import { useUser } from "../../store/slices/userSlice";

// Types
interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

// interface UserData {
//   data?: {
//     profile?: {
//       role?: {
//         roleName: string;
//       };
//     };
//   };
// }

interface FormValues {
  username: string;
  password: string;
}

// Custom Toast Component
const CustomToast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgColor = {
    success: "bg-teal-100 border-teal-500",
    error: "bg-red-100 border-red-500",
    info: "bg-blue-100 border-blue-500",
  };

  const iconColor = {
    success: "text-teal-600",
    error: "text-red-600",
    info: "text-blue-600",
  };

  const Icon = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />,
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg border-l-4 ${bgColor[type]} p-4 flex items-start space-x-3 transition-all duration-300 animate-fade-in`}
    >
      <div className={`flex-shrink-0 ${iconColor[type]}`}>{Icon[type]}</div>
      <div className="flex-1 text-sm font-medium text-gray-800">{message}</div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Custom Toast Hook
const useToast = () => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const ToastComponent = () => {
    if (!toast) return null;
    return (
      <CustomToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    );
  };

  return { showToast, ToastComponent };
};

// Mock Check and X icons for the toast
const Check = ({ className }: { className: string }) => <div className={className}>✓</div>;
const X = ({ className }: { className: string }) => <div className={className}>✕</div>;
const AlertCircle = ({ className }: { className: string }) => <div className={className}>⚠</div>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();
  const [searchParams] = useSearchParams();
  const [formValues, setFormValues] = useState<FormValues>({
    username: "",
    password: "",
  });

  const { setUserInStore } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/sign-in", {
        userName: formValues.username,
        password: formValues.password,
      });

      if (response.status === 200) {
        const data = response.data;
        const profile = data.data.profile;
        // console.log("Login response data:", data);
        console.log("User profile:", profile);
        setUserInStore({
          profile: {
            id: profile.userId,
            name: profile.userName,
            email: profile.email,
            mobile: profile.mobile,
            role: profile.role,
            // permissions: response.data.data.permissions,
          },
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        });
        showToast("Login successful!", "success");
        const roleName = data?.data?.profile?.role?.roleName;
        console.log("User role:", roleName);

        if (roleName === "Admin" || roleName === "Super Admin") {
          navigate("/dashboard");
        } else if (roleName === "Vendor") {
          navigate("/dashboard");
        } else {
          const redirectPath = searchParams.get("redirect") || "/";
          navigate(redirectPath);
        }
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.error || "Invalid Credentials",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 flex items-center justify-center p-4">
      {/* Toast Component */}
      <ToastComponent />

      <div className="w-full max-w-md">
        {/* Main login card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-teal-100 overflow-hidden">
          {/* Header section with gradient */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-teal-100 text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          {/* Form section */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Username or Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                  </div>
                  <input
                    name="username"
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                    value={formValues.username}
                    onChange={handleChange}
                    placeholder="Enter your username or email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                    value={formValues.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <a
                  href="/forgetpassword"
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-teal-400 disabled:to-teal-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {/* Sign up link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Secure login protected by advanced encryption
          </p>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}