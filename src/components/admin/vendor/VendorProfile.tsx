import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  Building2,
  FileText,
  Key,
  Percent,
  DollarSign,
  Info,
  Eye,
  EyeClosed,
} from "lucide-react";
import { toast } from "react-toastify";
import apiClient from "../../../API/apiClient";
// import Layout from "../../utils/Layout";
// import { useUser } from "../../appContext/UserContext";

interface VendorData {
  vendorName: string;
  vendorAddress: string;
  defaultVendorCommission: number;
  walletBalance: number;
  defaultPortalCommission: number;
  email: string;
  mobileNumber: string;
  vendorId: string;
  gstin: string;
  pan: string;
  remark: string;
  bankName: string;
  branchName: string;
  ifsc: string;
  accountNumber: string;
  apiKey: string;
  aadharFilePath?: string;
  gstFilePath?: string;
  cancelledChequeFilePath?: string;
  [key: string]: any; // For any additional properties
}

interface InfoCardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: string | number;
  span?: boolean;
}

const VendorProfile: React.FC = () => {
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingApiKey, setGeneratingApiKey] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  const { user } = useUser();

  const isVendor = user?.role?.roleName === "Vendor";

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);

        // Get vendorId from localStorage
        const vendorId = localStorage.getItem("vendorId");

        if (!vendorId) {
          setError("Vendor ID not found in localStorage");
          return;
        }

        const response: any = await apiClient.get(`/vendor/get-by-id/${vendorId}`);

        if (response.data.status === "success") {
          setVendorData(response.data.data);
        } else {
          setError(response.message || "Failed to fetch vendor data");
        }
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        setError("An error occurred while fetching vendor data");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const generateNewApiKey = async () => {
    try {
      setGeneratingApiKey(true);

      // Get vendorId from localStorage
      const vendorId = localStorage.getItem("vendorId");

      if (!vendorId) {
        setError("Vendor ID not found in localStorage");
        toast.error("Vendor ID not found in localStorage");
        return;
      }

      const response = await apiClient.get(
        `/vendor/generate-new-api-key/${vendorId}`
      );

      if (response.data.status === "success") {
        // Update the vendor data with the new API key
        setVendorData((prevData) => ({
          ...prevData!,
          apiKey: response.data.data.apiKey || response.data.apiKey,
        }));

        toast.success("New API key generated successfully!");
      } else {
        setError(response.data.message || "Failed to generate new API key");
        toast.error(response.data.message || "Failed to generate new API key");
      }
    } catch (err) {
      console.error("Error generating new API key:", err);
      setError("An error occurred while generating new API key");
      toast.error("An error occurred while generating new API key");
    } finally {
      setGeneratingApiKey(false);
    }
  };

  const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, title, value, span = false }) => (
    <div
      className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 ${
        span ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className="bg-teal-100 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-teal-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </h3>
          <p className="mt-2 text-lg font-semibold text-gray-900 break-words">
            {value || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          <p className="text-teal-700 font-medium">Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Error Loading Profile
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vendorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md mx-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No Vendor Data
            </h2>
            <p className="text-gray-600">Vendor data could not be loaded</p>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-6 mb-6 md:mb-0">
                <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {vendorData.vendorName}
                  </h1>
                  <p className="text-lg text-gray-600 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-teal-500" />
                    {vendorData.vendorAddress}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {isVendor && (
                  <div className="bg-teal-100 px-4 py-2 rounded-lg">
                    <span className="text-sm text-teal-700 font-medium">
                      Vendor Commission
                    </span>
                    <p className="text-xl font-bold text-teal-900">
                      {vendorData.defaultVendorCommission}%
                    </p>
                  </div>
                )}
                <div className="bg-teal-100 px-4 py-2 rounded-lg">
                  <span className="text-sm text-emerald-700 font-medium">
                    Wallet Balance
                  </span>
                  <p className="text-xl font-bold text-emerald-900">
                    ₹{vendorData.walletBalance}
                  </p>
                </div>
                <div className="bg-cyan-100 px-4 py-2 rounded-lg">
                  <span className="text-sm text-cyan-700 font-medium">
                    Portal Commission
                  </span>
                  <p className="text-xl font-bold text-cyan-900">
                    {vendorData.defaultPortalCommission}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <InfoCard
              icon={Mail}
              title="Email Address"
              value={vendorData.email}
            />
            <InfoCard
              icon={Phone}
              title="Mobile Number"
              value={vendorData.mobileNumber}
            />
            <InfoCard
              icon={User}
              title="Vendor ID"
              value={vendorData.vendorId}
              span
            />

            {/* Tax Information */}
            <InfoCard icon={FileText} title="GSTIN" value={vendorData.gstin} />
            <InfoCard
              icon={CreditCard}
              title="PAN Number"
              value={vendorData.pan}
            />
            <InfoCard
              icon={Info}
              title="Remarks"
              value={vendorData.remark}
              span
            />

            {/* Banking Information */}
            <InfoCard
              icon={Building2}
              title="Bank Name"
              value={vendorData.bankName}
            />
            <InfoCard
              icon={MapPin}
              title="Branch Name"
              value={vendorData.branchName}
            />
            <InfoCard icon={Key} title="IFSC Code" value={vendorData.ifsc} />
            <InfoCard
              icon={CreditCard}
              title="Account Number"
              value={vendorData.accountNumber}
              span
            />

            {/* API Information */}
            {!isVendor && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 lg:col-span-3">
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <Key className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      API Key
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg ">
                      <code className="text-sm text-gray-800 font-mono break-all ">
                        {showApiKey ? vendorData.apiKey : "•••••••••••••••••••"}
                      </code>
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="ml-3 text-teal-600 hover:text-teal-800"
                      >
                        {showApiKey ? (
                          <EyeClosed className="w-5 h-5 " />
                        ) : (
                          <Eye className="w-5 h-5 mt-2 " />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={generateNewApiKey}
                      disabled={generatingApiKey}
                      className={`mt-3 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        generatingApiKey
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700"
                      }`}
                    >
                      {generatingApiKey ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Generating...</span>
                        </div>
                      ) : (
                        "Get New API Key"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Document Status */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 lg:col-span-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-teal-600" />
                Document Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Aadhar Document
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vendorData.aadharFilePath
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vendorData.aadharFilePath ? "Uploaded" : "Not Uploaded"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    GST Document
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vendorData.gstFilePath
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vendorData.gstFilePath ? "Uploaded" : "Not Uploaded"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Cancelled Cheque
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vendorData.cancelledChequeFilePath
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vendorData.cancelledChequeFilePath
                      ? "Uploaded"
                      : "Not Uploaded"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default VendorProfile;