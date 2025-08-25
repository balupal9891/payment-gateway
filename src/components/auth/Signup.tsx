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
  Globe,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiClient from "../../API/apiClient";
// import { useUser } from "../appContext/UserContext";
// import { Helmet } from "react-helmet";

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
  type?: string; // default: "text"
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: any;
  touched?: any;
  icon?: LucideIcon; // lucide-react icon type
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
    className={`fixed top-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${
      type === "success" ? "border-teal-500" : "border-red-500"
    } p-4 flex items-center space-x-3 animate-slide-in z-50`}
  >
    {type === "success" ? (
      <CheckCircle className="text-teal-500 flex-shrink-0" size={20} />
    ) : (
      <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
    )}
    <div className="flex-1">
      <p
        className={`text-sm font-medium ${
          type === "success" ? "text-teal-800" : "text-red-800"
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
            className={`absolute left-3 top-3 transition-colors duration-200 ${
              focused || hasValue ? "text-teal-500" : "text-gray-400"
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
          className={`w-full px-3 py-2.5 ${Icon ? "pl-10" : "pl-3"} ${
            hasToggle ? "pr-10" : "pr-3"
          } 
            border-2 rounded-lg transition-all duration-200 outline-none text-sm
            ${
              error && touched
                ? "border-red-500 focus:border-red-500"
                : focused || hasValue
                ? "border-teal-500 focus:border-teal-500"
                : "border-gray-300 focus:border-teal-500"
            }
            ${focused ? "shadow-md" : ""}
          `}
        />

        <label
          className={`absolute ${
            Icon ? "left-10" : "left-3"
          } transition-all duration-200 pointer-events-none
          ${
            focused || hasValue
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
  // const { setUserInContext } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const showApiMessage = (message: string, type: "success" | "error" = "error") => {
    setApiMessage({ message, type });
    setTimeout(() => setApiMessage(null), 5000);
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      region: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(3, "Full name must be at least 3 characters")
        .required("Full name is required"),
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
    onSubmit: async (values :any) => {
      setLoading(true);
      setApiMessage(null);

      try {
        const usernameResponse = await apiClient.get(
          `/auth/check-username/${values.email}`
        );

        if (usernameResponse.data?.isAvaible === false) {
          formik.setErrors({ email: "Email already exists" });
          showApiMessage(
            "This email is already registered. Please use a different email.",
            "error"
          );
          return;
        }

        const signupResponse = await apiClient.post("/auth/sign-up", {
          userName: values.email,
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          mobile: values.mobile,
          region: values.region,
        });

        if (signupResponse.data) {
          try {
            await apiClient.post("/auth/verification/send-otp", {
              value: values.email,
              contactMethod: "email",
            });

            showApiMessage(
              "Account created successfully! Please check your email for verification code.",
              "success"
            );

            const userData = {
              ...signupResponse.data,
              email: values.email,
              fullName: values.fullName,
              mobile: values.mobile,
              isVerified: false,
            };

            setTimeout(() => {
              navigate("/verify-email", {
                state: { userData, email: values.email, fromSignup: true },
              });
            }, 1500);
          } catch (otpError) {
            console.error("OTP sending failed:", otpError);
            showApiMessage(
              "Account created! However, there was an issue sending the verification email. You can request it again.",
              "error"
            );

            setTimeout(() => {
              navigate("/verify-email", {
                state: {
                  userData: signupResponse.data,
                  email: values.email,
                  fromSignup: true,
                  otpFailed: true,
                },
              });
            }, 2000);
          }
        }
      } catch (error: unknown) {
        console.error("Signup error:", error);
        if (typeof error === "object" && error && "validationErrors" in error) {
          const err = error as { validationErrors: Record<string, string[]> };
          const formErrors: Record<string, string> = {};
          Object.keys(err.validationErrors).forEach((field) => {
            formErrors[field] = err.validationErrors[field][0];
          });
          formik.setErrors(formErrors);
          showApiMessage("Please fix the validation errors and try again.", "error");
        } else if (typeof error === "object" && error && "userMessage" in error) {
          showApiMessage((error as any).userMessage, "error");
        } else {
          showApiMessage("Something went wrong. Please try again.", "error");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      {/* <Helmet>
        <title>Create Your Motifesim Account</title>
      </Helmet> */}
      <div className="min-h-screen w-full flex bg-white" style={{ height: "90%" }}>
        {/* Left Panel */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute bottom-40 right-20 w-60 h-60 bg-white rounded-full"></div>
            <div className="absolute top-60 right-40 w-20 h-20 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center mb-30 left-20">
            <div className="mb-8">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                <Smartphone className="text-white" size={48} />
              </div>
              <h1 className="text-4xl font-bold mb-4">Welcome to eSIM World</h1>
              <p className="text-xl text-teal-100 mb-1leading-relaxed">
                Connect globally with instant eSIM activation. No physical SIM cards needed.
              </p>
            </div>

            <div className="space-y-7 max-w-sm">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="text-white" size={16} />
                </div>
                <span className="text-teal-100">Instant activation worldwide</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="text-white" size={16} />
                </div>
                <span className="text-teal-100">200+ countries coverage</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-white" size={16} />
                </div>
                <span className="text-teal-100">No roaming charges</span>
              </div>
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
              <p className="text-gray-600">Join thousands of travelers using eSIM</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <CompactFloatingInput
                label="Full Name"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={formik.errors.fullName}
                touched={formik.touched.fullName}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 mt-6 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <Smartphone size={18} />
                  </>
                )}
              </button>
            </form>

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
