import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  AlertCircle,
  X,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import baseURL from "../../API/baseUrl";
import { useUser } from "../../store/slices/userSlice";

interface SuccessOverlayProps {
  message: string;
}

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export interface InputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: any;
  touched?: any;
  icon?: LucideIcon;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  hasToggle?: boolean;
  className?: string;
}

const SuccessOverlay: React.FC<SuccessOverlayProps> = ({ message }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white px-8 py-6 rounded-lg shadow-xl max-w-md text-center animate-fade-in">
      <h2 className="text-2xl font-semibold text-teal-700 mb-3">🎉 Welcome!</h2>
      <p className="text-gray-700">{message}</p>
    </div>
    <style>{`
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-fade-in {
        animation: fade-in 0.3s ease-out;
      }
    `}</style>
  </div>
);

const CustomToast: React.FC<ToastProps> = ({ message, type, onClose }) => (
  <div
    className={`fixed top-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${type === "success" ? "border-teal-500" : "border-red-500"
      } p-4 flex items-center space-x-3 animate-slide-in z-50`}
  >
    {type === "success" ? (
      <CheckCircle className="text-teal-500 flex-shrink-0" size={20} />
    ) : (
      <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
    )}
    <div className="flex-1">
      <p
        className={`text-sm font-medium ${type === "success" ? "text-teal-800" : "text-red-800"
          }`}
      >
        {message}
      </p>
    </div>
    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
      <X size={16} />
    </button>
  </div>
);

const CompactFloatingInput: React.FC<InputProps> = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  touched,
  icon: Icon,
  showPassword,
  onTogglePassword,
  hasToggle = false,
  className = "",
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {Icon && (
          <Icon
            className={`absolute left-3 top-3 transition-colors duration-200 ${focused || hasValue ? "text-teal-500" : "text-gray-400"
              }`}
            size={18}
          />
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full px-3 py-2.5 ${Icon ? "pl-10" : "pl-3"} ${hasToggle ? "pr-10" : "pr-3"
            } 
            border-2 rounded-lg transition-all duration-200 outline-none text-sm
            ${error && touched
              ? "border-red-500 focus:border-red-500"
              : focused || hasValue
                ? "border-teal-500 focus:border-teal-500"
                : "border-gray-300 focus:border-teal-500"
            }
            ${focused ? "shadow-md" : ""}
          `}
        />

        <label
          className={`absolute ${Icon ? "left-10" : "left-3"} transition-all duration-200 pointer-events-none
          ${focused || hasValue
              ? "-top-2 text-xs bg-white px-1 font-medium" +
              (error && touched ? " text-red-500" : " text-teal-500")
              : "top-2.5 text-gray-500 text-sm"
            }
        `}
        >
          {label}
        </label>

        {hasToggle && (
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={onTogglePassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && touched && (
        <div className="mt-1 text-red-500 text-xs flex items-center space-x-1">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);

  const { setUserInStore } = useUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const showApiMessage = (message: string, type: "success" | "error" = "error") => {
    setApiMessage({ message, type });
    setTimeout(() => setApiMessage(null), 5000);
  };

  const handleSendOtp = async (values: any) => {
    setLoading(true);
    setApiMessage(null);

    try {
      // Send OTP to email
      const otpResponse = await axios.post(`${baseURL}/auth/verification/send-otp`, {
        value: values.email,
        contactMethod: "email",
      });

      if (otpResponse.status === 200) {
        setOtpSent(true);
        showApiMessage("Verification code sent to your email", "success");
        return true;
      } else {
        showApiMessage("Failed to send verification code", "error");
        return false;
      }
    } catch (error: any) {
      console.error("OTP sending error:", error);
      showApiMessage(
        error.response?.data?.message || "Failed to send verification code",
        "error"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndSignup = async (values: any) => {
    setVerificationLoading(true);
    setApiMessage(null);

    try {
      // Verify OTP
      const verifyResponse = await axios.post(`${baseURL}/auth/verification/verify-otp`, {
        value: values.email,
        contactMethod: "email",
        otp: otp,
      });

      if (verifyResponse.status === 200) {
        // OTP verified successfully, now create user
        const response = await axios.post(`${baseURL}/auth/sign-up`, {
          vendorName: values.vendorName,
          email: values.email,
          password: values.password,
          mobile: values.mobile,
        });

        if (response.data) {
          const data = response.data;
          const profile = data.data.profile;
          setUserInStore({
            profile: profile,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          });
          showApiMessage("Account created successfully!", "success");
          const roleName = data?.data?.profile?.role?.roleName;
          console.log("User role:", roleName);

          if (roleName === "Admin" || roleName === "Super Admin") {
            navigate("/dashboard");
          } else if (roleName === "Vendor") {
            navigate("/dashboard");
          } else {
            navigate('/');
          }
        }
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      showApiMessage(
        error.response?.data?.message || "Verification failed. Please try again.",
        "error"
      );
    } finally {
      setVerificationLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      vendorName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      vendorName: Yup.string()
        .min(3, "Vendor name must be at least 3 characters")
        .required("Vendor name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Please enter a valid mobile number")
        .required("Mobile number is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (values: any) => {
      if (!otpSent) {
        // First step: Send OTP
        await handleSendOtp(values);
      } else {
        // Second step: Verify OTP and sign up
        await handleVerifyOtpAndSignup(values);
      }
    },
  });

  return (
    <>
      <div className="min-h-screen w-full flex bg-white" style={{ height: "90%" }}>
        {/* Left Panel with design and animation */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative z-10 px-12 text-white">
              <h1 className="text-4xl font-bold mb-6">Simplify Global Payments</h1>
              <p className="text-xl mb-8">Unify payment processing with our multi-gateway platform. Fast integration, maximum flexibility.</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mr-3">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span>Integrate once, access 20+ payment gateways</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mr-3">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span>Global payment processing in 150+ currencies</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mr-3">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span>Seamless vendor onboarding & management</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mr-3">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span>Advanced fraud protection & compliance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center mr-3">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span>Real-time analytics & reporting dashboard</span>
                </div>
              </div>

              {/* Animated circles in background */}
              <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-teal-500 opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-teal-400 opacity-15 animate-ping"></div>
              <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-white opacity-10 animate-bounce"></div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="flex-1 lg:max-w-lg xl:max-w-xl flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {otpSent ? "Verify Email" : "Create Account"}
              </h2>
              <p className="text-gray-600">
                {otpSent
                  ? "Enter the verification code sent to your email"
                  : "Join thousands of travelers using eSIM"}
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {!otpSent ? (
                <>
                  <CompactFloatingInput
                    label="Vendor Name"
                    name="vendorName"
                    value={formik.values.vendorName}
                    onChange={formik.handleChange}
                    error={formik.errors.vendorName}
                    touched={formik.touched.vendorName}
                    icon={User}
                  />
                  <CompactFloatingInput
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.errors.email}
                    touched={formik.touched.email}
                    icon={Mail}
                  />
                  <CompactFloatingInput
                    label="Mobile Number"
                    type="text"
                    name="mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    error={formik.errors.mobile}
                    touched={formik.touched.mobile}
                    icon={Phone}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <CompactFloatingInput
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      error={formik.errors.password}
                      touched={formik.touched.password}
                      icon={Lock}
                      showPassword={showPassword}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                      hasToggle
                    />
                    <CompactFloatingInput
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      error={formik.errors.confirmPassword}
                      touched={formik.touched.confirmPassword}
                      icon={Lock}
                      showPassword={showConfirmPassword}
                      onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                      hasToggle
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <CompactFloatingInput
                    label="Verification Code"
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    icon={CheckCircle}
                  />
                  <p className="text-sm text-gray-600 text-center">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      className="text-teal-600 hover:text-teal-700 font-medium"
                      onClick={() => handleSendOtp(formik.values)}
                    >
                      Resend
                    </button>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || verificationLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 mt-6 shadow-lg hover:shadow-xl"
              >
                {loading || verificationLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {otpSent ? "Verifying..." : "Sending Code..."}
                    </span>
                  </div>
                ) : (
                  <>
                    <span>{otpSent ? "Verify & Create Account" : "Send Verification Code"}</span>
                    <Smartphone size={18} />
                  </>
                )}
              </button>
            </form>

            {otpSent && (
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-teal-600 hover:text-teal-700 py-2 rounded-lg font-medium transition-all duration-200"
              >
                ← Back to edit information
              </button>
            )}

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {apiMessage && (
          <CustomToast
            message={apiMessage.message}
            type={apiMessage.type}
            onClose={() => setApiMessage(null)}
          />
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}