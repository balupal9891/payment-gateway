import React, { useState, useEffect, useMemo, useCallback, type ChangeEvent, type FormEvent } from "react";
import {
  Search,
  Building,
  Mail,
  Phone,
  FileText,
  CreditCard,
  MapPin,
  Percent,
  CheckSquare,
  Square,
  Plus,
  AlertCircle,
  CheckCircle,
  Save,
  User,
  Loader,
  Upload,
  FileCheck,
} from "lucide-react";
import apiClient from "../../../API/apiClient";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../../../API/baseUrl";
import Cookies from "js-cookie";

interface FormData {
  vendorName: string;
  vendorAddress: string;
  email: string;
  mobileNumber: string;
}

interface Errors {
  [key: string]: string;
}

interface Message {
  type: string;
  text: string;
}

const VendorRegistration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    vendorName: "",
    vendorAddress: "",
    email: "",
    mobileNumber: ""
  });

  // const [currentPage, setCurrentPage] = useState<number>(1);
  // const [defaultVendorCommission, setDefaultVendorCommission] = useState<string>("");
  // const [defaultPortalCommission, setDefaultPortalCommission] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<Message>({ type: "", text: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message.text]);

  const validateField = (name: string, value: string | File | null | boolean) => {
    const newErrors = { ...errors };

    switch (name) {
      case "vendorName":
        if (!value || !(value as string).trim()) {
          newErrors.vendorName = "Vendor name is required";
        } else if ((value as string).trim().length < 2) {
          newErrors.vendorName = "Vendor name must be at least 2 characters";
        } else {
          delete newErrors.vendorName;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value as string)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "mobileNumber":
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!value) {
          newErrors.mobileNumber = "Mobile number is required";
        } else if (!mobileRegex.test(value as string)) {
          newErrors.mobileNumber =
            "Please enter a valid 10-digit mobile number";
        } else {
          delete newErrors.mobileNumber;
        }
        break;

      case "vendorAddress":
        if (!value || !(value as string).trim()) {
          newErrors.vendorAddress = "Vendor address is required";
        } else {
          delete newErrors.vendorAddress;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue: string = value;

    if (name === "pan" || name === "gstin" || name === "ifsc") {
      processedValue = value.toUpperCase().trim();
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    validateField(name, processedValue);
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      "vendorName",
      "vendorAddress",
      "email",
      "mobileNumber"
    ] as const;

    // const requiredFiles = ["aadharFile", "gstFile", "cancelledChequeFile"] as const;

    const newErrors: Errors = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} is required`;
      }
    });

    // Validate file fields
    // requiredFiles.forEach((field) => {
    //   if (!formData[field] || !(formData[field] instanceof File)) {
    //     newErrors[field] = `${field
    //       .replace(/([A-Z])/g, " $1")
    //       .replace(/^./, (str) => str.toUpperCase())} is required`;
    //   }
    // });

    // Validate each field with its specific validation
    requiredFields.forEach((field) => {
      if (formData[field]) {
        validateField(field, formData[field]);
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys({ ...errors, ...newErrors }).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Please fix all validation errors before submitting",
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("vendorName", formData.vendorName);
      formDataToSend.append("vendorAddress", formData.vendorAddress);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobileNumber", formData.mobileNumber);
      console.log("formData:", formData);
      const token = Cookies.get("accessToken");

      const response = await axios.post(`${baseURL}/vendor/new`, formDataToSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Vendor registration response:", response.data);
      setMessage({
        type: "success",
        text: "Vendor registered successfully!",
      });
      navigate("/admin/vendors");
    } catch (error: any) {
      console.error("Registration error:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to register vendor. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div
        className="h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8"
        style={{ height: "100%" }}
      >
        <div className="max-w-7xl mx-auto h-full">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-teal-500 px-6 py-4">
              <div className="flex items-center">
                <User className="text-white mr-3" size={24} />
                <h1 className="text-2xl font-bold text-white">
                  Vendor Registration
                </h1>
              </div>
            </div>

            {/* Message Display */}
            {message.text && (
              <div
                className={`px-6 py-4 ${
                  message.type === "success"
                    ? "bg-green-50 border-l-4 border-green-400"
                    : "bg-red-50 border-l-4 border-red-400"
                }`}
              >
                <div className="flex items-center">
                  {message.type === "success" ? (
                    <CheckCircle className="text-green-400 mr-2" size={20} />
                  ) : (
                    <AlertCircle className="text-red-400 mr-2" size={20} />
                  )}
                  <span
                    className={
                      message.type === "success"
                        ? "text-green-800"
                        : "text-red-800"
                    }
                  >
                    {message.text}
                  </span>
                </div>
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className="h-full"
            >
              <div
                className="p-6 overflow-y-auto"
                style={{ height: "calc(100% - 80px)" }}
              >
                {/* Basic Information */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="text-teal-500 mr-2" size={20} />
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vendor Name *
                      </label>
                      <input
                        type="text"
                        name="vendorName"
                        value={formData.vendorName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.vendorName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter vendor name"
                      />
                      {errors.vendorName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.vendorName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-2.5 text-gray-400"
                          size={18}
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="vendor@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <div className="relative">
                        <MapPin
                          className="absolute left-3 top-2.5 text-gray-400"
                          size={18}
                        />
                        <textarea
                          name="vendorAddress"
                          value={formData.vendorAddress}
                          onChange={handleInputChange}
                          rows={3}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                            errors.vendorAddress
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter complete address"
                        />
                      </div>
                      {errors.vendorAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.vendorAddress}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute left-3 top-2.5 text-gray-400"
                          size={18}
                        />
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                            errors.mobileNumber
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="9876543210"
                        />
                      </div>
                      {errors.mobileNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.mobileNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                
                

                {/* Remarks */}
                
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Any additional remarks or notes"
                  />
                </div> */}
              </div>

              {/* Submit Button */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-500 text-white py-3 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-2" size={20} />
                      Registering Vendor...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={20} />
                      Register Vendor
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default VendorRegistration;