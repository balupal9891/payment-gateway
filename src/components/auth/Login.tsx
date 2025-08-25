import { useEffect, useState, useCallback } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Phone,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import { useUser } from "../appContext/UserContext";
// import { useFormik } from "formik";
import baseURL from "../../API/baseUrl";
import apiClient from "../../API/apiClient";

// Types
interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

interface UserData {
  data?: {
    profile?: {
      role?: {
        roleName: string;
      };
    };
  };
}

interface FormValues {
  username: string;
  password: string;
  email: string;
  phone: string;
  otp: string;
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

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  }, []);

  const ToastComponent = useCallback(() => {
    if (!toast) return null;
    return (
      <CustomToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    );
  }, [toast]);

  return { showToast, ToastComponent };
};

// OTP Input Component
const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, length = 6 }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = [...value];
    newValue[index] = e.target.value;
    onChange(newValue.join(""));

    // Auto focus to next input
    if (e.target.value && index < length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, length);
    onChange(pasteData);
  };

  return (
    <div className="flex justify-center space-x-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
          pattern="[0-9]*"
          inputMode="numeric"
        />
      ))}
    </div>
  );
};

// Mock hooks and functions (replace with your actual implementations)
const useUser = () => ({
  setUserInContext: (data: UserData) => console.log('User set in context:', data)
});

const useFormik = (options: { initialValues: FormValues; onSubmit: (values: FormValues) => Promise<void> }) => {
  const [values, setValues] = useState<FormValues>(options.initialValues);
  
  return {
    values,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    },
    handleSubmit: (e: React.FormEvent) => {
      e.preventDefault();
      options.onSubmit(values);
    },
    setFieldValue: (field: string, value: string) => {
      setValues(prev => ({ ...prev, [field]: value }));
    }
  };
};

export default function LoginPage() {
  const { setUserInContext } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"email" | "phone" | "password">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
      phone: "",
      otp: "",
    },
    onSubmit: async (values: FormValues) => {
      setLoading(true);

      try {
        if (activeTab === "password") {
          const response = await apiClient.post("/auth/sign-in", {
            userName: values.username,
            password: values.password,
          });

          if (response.status === 200) {
            const data = response.data;
            setUserInContext(data);
            showToast("Login successful!", "success");
            const roleName = data?.data?.profile?.role?.roleName;
            console.log("User role:", roleName);

            if (roleName === "Admin") {
              navigate("/dashboard/admindashboard");
            } else if (roleName === "Vendor") {
              navigate("/dashboard/vendordashboard");
            } else if (roleName === "B2B Vendor") {
              navigate("/dashboard/vendordashboard");
            } else {
              const redirectPath = searchParams.get("redirect") || "/";
              navigate(redirectPath);
            }
          }
        } else if (activeTab === "email" || activeTab === "phone") {
          const response = await apiClient.post(
            "/auth/verification/verify-with-otp",
            {
              value: activeTab === "email" ? values.email : values.phone,
              otp: values.otp,
            }
          );

          if (response.status === 200) {
            const data = response.data;
            setUserInContext(data);
            showToast("Login successful!", "success");

            const roleName = data?.data?.profile?.role?.roleName;
            console.log("User role:", roleName);
            const normalizedRole = roleName?.trim().toLowerCase();
            if (roleName === "Admin") {
              navigate("/dashboard/admindashboard");
            } else if (roleName === "Vendor") {
              navigate("/dashboard/vendordashboard");
            } else if (roleName === "B2B Vendor") {
              navigate("/dashboard/vendordashboard");
            } else {
              const redirectPath = searchParams.get("redirect") || "/";
              navigate(redirectPath);
            }
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
    },
  });

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      const value =
        activeTab === "email" ? formik.values.email : formik.values.phone;

      await apiClient
        .post(`${baseURL}/auth/verification/login-with-otp`, {
          value,
        })
        .then((res: any) => {
          if (res.status === 200) {
            setOtpSent(true);
            showToast("OTP sent successfully!", "success");
          } else {
            showToast("Failed to send OTP", "error");
          }
        });
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setOtpLoading(false);
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
          <div className="px-8 py-4">
            <p className="text-teal-700 flex items-center justify-center font-bold text-sm ">
              Login With
            </p>

            <div className="flex mb-6 border-b border-gray-200">
              
              <button
                type="button"
                style={{cursor:"pointer"}}
                className={`flex-1 py-2 font-medium text-sm ${
                  activeTab === "email"
                    ? "text-teal-600 border-b-2 border-teal-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("email");
                  setOtpSent(false);
                }}
              >
                Email OTP
              </button>
              <button
                type="button"
                style={{cursor:"pointer"}}

                className={`flex-1 py-2 font-medium text-sm ${
                  activeTab === "phone"
                    ? "text-teal-600 border-b-2 border-teal-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("phone");
                  setOtpSent(false);
                }}
              >
                Phone OTP
              </button>
              <button
                type="button"
                style={{cursor:"pointer"}}

                className={`flex-1 py-2 font-medium text-sm ${
                  activeTab === "password"
                    ? "text-teal-600 border-b-2 border-teal-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("password");
                  setOtpSent(false);
                }}
              >
                Password
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Password login form */}
              {activeTab === "password" && (
                <>
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
                        value={formik.values.username}
                        onChange={formik.handleChange}
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
                        value={formik.values.password}
                        onChange={formik.handleChange}
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
                </>
              )}

              {/* Email OTP form */}
              {activeTab === "email" && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                      </div>
                      <input
                        name="email"
                        type="email"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all duration-200 bg-gray-50 focus:bg-white"
                        required
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        placeholder="Enter your email"
                        disabled={otpSent}
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        OTP
                      </label>
                      <OtpInput
                        value={formik.values.otp}
                        onChange={(value) => formik.setFieldValue("otp", value)}
                      />
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Enter the 6-digit OTP sent to your email
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Phone OTP form */}
              {activeTab === "phone" && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                      </div>
                      <input
                        name="phone"
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all duration-200 bg-gray-50 focus:bg-white"
                        required
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        placeholder="Enter your phone number"
                        disabled={otpSent}
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        OTP
                      </label>
                      <OtpInput
                        value={formik.values.otp}
                        onChange={(value) => formik.setFieldValue("otp", value)}
                      />
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Enter the 6-digit OTP sent to your phone
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Send/Resend OTP button */}
              {(activeTab === "email" || activeTab === "phone") && !otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={
                    otpLoading ||
                    (activeTab === "email" && !formik.values.email) ||
                    (activeTab === "phone" && !formik.values.phone)
                  }
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-teal-400 disabled:to-teal-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {otpLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <span>Send OTP</span>
                  )}
                </button>
              ) : null}

              {/* Resend OTP button */}
              {otpSent && (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Didn't receive OTP?</p>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline transition-colors"
                  >
                    {otpLoading ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
              )}

              {/* Submit button (for password login or OTP verification) */}
              {(activeTab === "password" || otpSent) && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-teal-400 disabled:to-teal-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
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
              )}

              {activeTab === "password" && (
                <div className="flex justify-end">
                  <a
                    href="/forgetpassword"
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              )}
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