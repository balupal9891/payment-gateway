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

interface FormData {
  vendorName: string;
  vendorAddress: string;
  email: string;
  mobileNumber: string;
  gstin: string;
  pan: string;
  remark: string;
  bankName: string;
  branchName: string;
  ifsc: string;
  accountNumber: string;
  aadharFile: File | null;
  gstFile: File | null;
  cancelledChequeFile: File | null;
  isB2B: boolean;
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
    mobileNumber: "",
    gstin: "",
    pan: "",
    remark: "",
    bankName: "",
    branchName: "",
    ifsc: "",
    accountNumber: "",
    aadharFile: null,
    gstFile: null,
    cancelledChequeFile: null,
    isB2B: false,
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [defaultVendorCommission, setDefaultVendorCommission] = useState<string>("");
  const [defaultPortalCommission, setDefaultPortalCommission] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<Message>({ type: "", text: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, fieldName: keyof FormData) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "File size should be less than 5MB",
        });
        // Don't set the file if validation fails
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setMessage({
          type: "error",
          text: "Please upload only JPG, PNG, or PDF files",
        });

        return;
      }

      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));

      // Clear any previous errors for this field
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // FIX 4: Auto-hide messages
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

      case "gstin":
        const gstinRegex =
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!value) {
          newErrors.gstin = "GSTIN is required";
        } else if (!gstinRegex.test(value as string)) {
          newErrors.gstin = "Please enter a valid GSTIN";
        } else {
          delete newErrors.gstin;
        }
        break;

      case "pan":
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!value) {
          newErrors.pan = "PAN is required";
        } else if (!panRegex.test(value as string)) {
          newErrors.pan = "Please enter a valid PAN";
        } else {
          delete newErrors.pan;
        }
        break;

      case "ifsc":
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!value) {
          newErrors.ifsc = "IFSC code is required";
        } else if (!ifscRegex.test(value as string)) {
          newErrors.ifsc = "Please enter a valid IFSC code";
        } else {
          delete newErrors.ifsc;
        }
        break;

      case "accountNumber":
        if (!value) {
          newErrors.accountNumber = "Account number is required";
        } else if ((value as string).length < 9 || (value as string).length > 18) {
          newErrors.accountNumber =
            "Account number must be between 9-18 digits";
        } else {
          delete newErrors.accountNumber;
        }
        break;
      case "vendorAddress":
        if (!value || !(value as string).trim()) {
          newErrors.vendorAddress = "Vendor address is required";
        } else {
          delete newErrors.vendorAddress;
        }
        break;

      case "bankName":
        if (!value || !(value as string).trim()) {
          newErrors.bankName = "Bank name is required";
        } else {
          delete newErrors.bankName;
        }
        break;

      case "branchName":
        if (!value || !(value as string).trim()) {
          newErrors.branchName = "Branch name is required";
        } else {
          delete newErrors.branchName;
        }
        break;
      case "cancelledChequeFile":
        if (!value) {
          newErrors.cancelledChequeFile = "Cancelled cheque is required";
        } else {
          delete newErrors.cancelledChequeFile;
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
      "mobileNumber",
      "gstin",
      "pan",
      "bankName",
      "branchName",
      "ifsc",
      "accountNumber",
    ] as const;

    const requiredFiles = ["aadharFile", "gstFile", "cancelledChequeFile"] as const;

    const newErrors: Errors = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} is required`;
      }
    });

    // Validate file fields
    requiredFiles.forEach((field) => {
      if (!formData[field] || !(formData[field] instanceof File)) {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} is required`;
      }
    });

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
      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("vendorName", formData.vendorName);
      formDataToSend.append("vendorAddress", formData.vendorAddress);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobileNumber", formData.mobileNumber);
      formDataToSend.append("gstin", formData.gstin);
      formDataToSend.append("pan", formData.pan);
      formDataToSend.append("remark", formData.remark || "");
      formDataToSend.append(
        "defaultVendorCommission",
        String(defaultVendorCommission)
      );
      formDataToSend.append(
        "defaultPortalCommission",
        String(defaultPortalCommission)
      );
      formDataToSend.append("bankName", formData.bankName);
      formDataToSend.append("branchName", formData.branchName);
      formDataToSend.append("ifsc", formData.ifsc);
      formDataToSend.append("accountNumber", formData.accountNumber);
      formDataToSend.append("isB2B", formData.isB2B.toString());
      if (formData.aadharFile) formDataToSend.append("aadharFile", formData.aadharFile);
      if (formData.gstFile) formDataToSend.append("gstFile", formData.gstFile);
      if (formData.cancelledChequeFile) formDataToSend.append(
        "cancelledChequeFile",
        formData.cancelledChequeFile
      );

      console.log("Files being sent:");
      console.log("aadharFile:", formData.aadharFile);
      console.log("gstFile:", formData.gstFile);
      console.log("cancelledChequeFile:", formData.cancelledChequeFile);
      console.log("vendor commission", defaultVendorCommission);
      console.log("portal commission", defaultPortalCommission);
      console.log("formData:", formData);
      console.log("Submitting FormData with files");

      const response = await apiClient.post("/vendor/new", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Vendor registration response:", response.data);
      setMessage({
        type: "success",
        text: "Vendor registered successfully!",
      });
      navigate("/dashboard/vendormanagement");
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

                {/* Tax Information */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="text-teal-500 mr-2" size={20} />
                    Tax Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GSTIN *
                      </label>
                      <input
                        type="text"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.gstin ? "border-red-500" : "border-gray-300"
                        } uppercase`}
                        placeholder="29ABCDE1234F1Z5"
                      />
                      {errors.gstin && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gstin}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PAN *
                      </label>
                      <input
                        type="text"
                        name="pan"
                        value={formData.pan}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.pan ? "border-red-500" : "border-gray-300"
                        } uppercase`}
                        placeholder="ABCDE1234F"
                      />
                      {errors.pan && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.pan}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bank Information */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="text-teal-500 mr-2" size={20} />
                    Bank Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.bankName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="HDFC Bank"
                      />
                      {errors.bankName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.bankName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch Name *
                      </label>
                      <input
                        type="text"
                        name="branchName"
                        value={formData.branchName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.branchName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Connaught Place"
                      />
                      {errors.branchName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.branchName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        name="ifsc"
                        value={formData.ifsc}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.ifsc ? "border-red-500" : "border-gray-300"
                        } uppercase`}
                        placeholder="HDFC0000123"
                      />

                      {errors.ifsc && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.ifsc}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.accountNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="123456789012"
                      />
                      {errors.accountNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.accountNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FileCheck className="text-teal-500 mr-2" size={20} />
                    Documents & API Access
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Apply for API */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apply for API Access
                      </label>
                      <div className="flex items-center space-x-4 mt-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="isB2B"
                            value="true"
                            checked={formData.isB2B === true}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                isB2B: true,
                              }))
                            }
                            className="mr-2 text-teal-600 focus:ring-teal-500"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="isB2B"
                            value="false"
                            checked={formData.isB2B === false}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                isB2B: false,
                              }))
                            }
                            className="mr-2 text-teal-600 focus:ring-teal-500"
                          />
                          No
                        </label>
                      </div>
                    </div>

                    {/* Aadhar Card Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aadhar Card *
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="aadharFile"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileUpload(e, "aadharFile")}
                          className="hidden"
                        />
                        <label
                          htmlFor="aadharFile"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span
                            className={
                              formData.aadharFile
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            {formData.aadharFile
                              ? formData.aadharFile.name
                              : "Choose Aadhar Card file"}
                          </span>
                          <Upload size={18} className="text-gray-400" />
                        </label>
                      </div>
                      {errors.aadharFile && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.aadharFile}
                        </p>
                      )}
                    </div>

                    {/* GST Card Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST Certificate *
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="gstFile"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileUpload(e, "gstFile")}
                          className="hidden"
                        />
                        <label
                          htmlFor="gstFile"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span
                            className={
                              formData.gstFile
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            {formData.gstFile
                              ? formData.gstFile.name
                              : "Choose GST Certificate file"}
                          </span>
                          <Upload size={18} className="text-gray-400" />
                        </label>
                      </div>
                      {errors.gstFile && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gstFile}
                        </p>
                      )}
                    </div>

                    {/* Cancelled Cheque Upload */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cancelled Cheque *
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="cancelledChequeFile"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) =>
                            handleFileUpload(e, "cancelledChequeFile")
                          }
                          className="hidden"
                        />
                        <label
                          htmlFor="cancelledChequeFile"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span
                            className={
                              formData.cancelledChequeFile
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            {formData.cancelledChequeFile
                              ? formData.cancelledChequeFile.name
                              : "Choose Cancelled Cheque file"}
                          </span>
                          <Upload size={18} className="text-gray-400" />
                        </label>
                      </div>
                      {errors.cancelledChequeFile && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cancelledChequeFile}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
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
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mt-4 flex items-center">
                    <Percent className="text-teal-500 mr-2" size={20} />
                    Default Commission Setup
                  </h2>

                  <div className="bg-gray-50 p-1 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Portal Commission (%)
                        </label>
                        <input
                          type="number"
                          value={defaultPortalCommission}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setDefaultPortalCommission(e.target.value)
                          }
                          min="0"
                          max="100"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Enter portal commission rate"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Vendor Commission (%)
                        </label>
                        <input
                          type="number"
                          value={defaultVendorCommission}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setDefaultVendorCommission(e.target.value)
                          }
                          min="0"
                          max="100"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Enter vendor commission rate"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      These commission rates will be applied as default values
                      for this vendor.
                    </p>
                  </div>
                </div>
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