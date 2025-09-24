import React, { useState, useEffect } from "react";
import {
  Edit,
  Building2,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  ChevronLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Globe,
  Upload,
  FileText,
  Trash2,
  Shield,
  ShieldCheck,
  Building,
  Briefcase,
  Store,
  User,
  Calendar,
  FileCheck,
  BanknoteIcon,
  Download,
  Eye,
  BadgeCheck,
  BadgeX,
  ExternalLink
} from "lucide-react";
import apiClient from "../../../API/apiClient";
import axios from "axios";
import baseURL, { baseDocURL } from "../../../API/baseUrl";

interface Vendor {
  vendorId: string;
  vendorName: string;
  email: string;
  mobile: string;
  panNumber: string;
  panName: string;
  dob: string;
  panStatus: string;
  gstin: string;
  legalNameOfBusiness: string;
  tradeNameOfBusiness: string;
  principalPlaceAddress: string;
  constitutionOfBusiness: string;
  natureOfBusinessActivities: string[];
  gstinStatus: string;
  gstinValid: boolean;
  cinNumber: string;
  companyName: string;
  incorporationDate: string;
  cinStatus: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  nameAtBank: string;
  bankCity: string;
  bankBranch: string;
  bankStatus: string;
  ifscDetails: any;
  websiteLink: string;
  mobileAppLink: string;
  lineOfBusiness: string;
  termAndConditionUrl: string;
  refundPolicyUrl: string;
  cancellationPolicyUrl: string;
  contactSupportInfo: string;
  isPanVerified: boolean;
  isGstVerified: boolean;
  isCinVerified: boolean;
  isBankVerified: boolean;
  isPanVerifiedByAdmin: boolean;
  isGstVerifiedByAdmin: boolean;
  isCinVerifiedByAdmin: boolean;
  isBankVerifiedByAdmin: boolean;
  isKycVerified: boolean;
  panPath: string;
  aadharPath: string;
  boardResolutionPath: string;
  cinCertificatePath: string;
  aoaPath: string;
  moaPath: string;
  bankChequePath: string;
  formStatus: string;
  roleId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

interface VendorDetailsProps {
  vendorId: string;
  onBack: () => void;
}

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendorId, onBack }) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<Partial<Vendor>>({});
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<string>('pan');

  const fetchVendorDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${baseURL}/vendor/get-by-id/${vendorId}`);

      if (response.data.data) {
        setVendor(response.data.data);
        setEditForm(response.data.data);
      } else {
        throw new Error("No vendor data received");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch vendor details");
      console.error("Error fetching vendor details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      setSaving(true);
      setError(null);

      const updateData = {
        vendorId: editForm.vendorId,
        vendorName: editForm.vendorName,
        email: editForm.email,
        mobile: editForm.mobile,
        websiteLink: editForm.websiteLink,
        mobileAppLink: editForm.mobileAppLink,
        lineOfBusiness: editForm.lineOfBusiness,
      };

      const response = await apiClient.patch('/vendor/update', updateData);

      if (response.data) {
        setVendor(editForm as Vendor);
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update vendor");
      console.error("Error updating vendor:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (): void => {
    setEditForm(vendor || {});
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (field: keyof Vendor, value: string): void => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVerifyDocument = async (docType: string): Promise<void> => {
    try {
      setVerifying(docType);
      setError(null);

      const response = await apiClient.post(`/vendor/verify-doc/${vendorId}`, {
        documentType: docType,
        isVerified: true
      });

      if (response.data) {
        await fetchVendorDetails();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify document");
    } finally {
      setVerifying(null);
    }
  };

  const handleUnverifyDocument = async (docType: string): Promise<void> => {
    try {
      setVerifying(docType);
      setError(null);

      const response = await apiClient.post(`/vendor/verify-doc/${vendorId}`, {
        documentType: docType,
        isVerified: false
      });

      if (response.data) {
        await fetchVendorDetails();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to unverify document");
    } finally {
      setVerifying(null);
    }
  };

  const handleVerifyKYC = async (): Promise<void> => {
    try {
      setVerifying('kyc');
      setError(null);

      const response = await apiClient.post(`/vendor/verify-kyc/${vendorId}`, {
        isKycVerified: true
      });

      if (response.data) {
        await fetchVendorDetails();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify KYC");
    } finally {
      setVerifying(null);
    }
  };

  const handleDownloadDocument = async (filePath: string, fileName: string) => {
    try {
      // Fetch the file
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }

      // Convert to blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Set the download filename with proper extension
      const fileExtension = filePath.split('.').pop() || 'pdf';
      link.download = `${fileName.replace(/\s+/g, '_')}.${fileExtension}`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab if download fails
      window.open(filePath, '_blank');
    }
  };

  const handleGetPath = (docPath: string | undefined): (string | undefined | null) => {
    if (docPath) {
      const fullUrl = `${baseDocURL}${docPath}`;
      return fullUrl;
    }
    return null
  };

  useEffect(() => {
    if (vendorId) {
      fetchVendorDetails();
    }
  }, [vendorId]);

  const renderVerificationStatus = (isVerified: boolean, verifiedByAdmin: boolean | null, status?: string) => {
    if (verifiedByAdmin) {
      return (
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
          <BadgeCheck className="w-3 h-3 mr-1" />
          Verified by Admin
        </span>
      );
    } else if (isVerified) {
      return (
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
          <ShieldCheck className="w-3 h-3 mr-1" />
          System Verified {status && `(${status})`}
        </span>
      );
    } else {
      return (
        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
          <BadgeX className="w-3 h-3 mr-1" />
          Pending {status && `(${status})`}
        </span>
      );
    }
  };

  const renderDocumentSection = () => {
    const documents = [
      {
        id: 'pan',
        name: 'PAN Card',
        number: vendor?.panNumber,
        path: handleGetPath(vendor?.panPath),
        isVerified: vendor?.isPanVerified,
        verifiedByAdmin: vendor?.isPanVerifiedByAdmin,
        status: vendor?.panStatus
      },
      {
        id: 'gst',
        name: 'GST Certificate',
        number: vendor?.gstin,
        path: null, // Changed to actual GST path
        isVerified: vendor?.isGstVerified,
        verifiedByAdmin: vendor?.isGstVerifiedByAdmin,
        status: vendor?.gstinStatus
      },
      {
        id: 'cin',
        name: 'CIN Certificate',
        number: vendor?.cinNumber,
        path: handleGetPath(vendor?.cinCertificatePath),
        isVerified: vendor?.isCinVerified,
        verifiedByAdmin: vendor?.isCinVerifiedByAdmin,
        status: vendor?.cinStatus
      },
      {
        id: 'bank',
        name: 'Bank Proof',
        number: vendor?.accountNumber,
        path: handleGetPath(vendor?.bankChequePath),
        isVerified: vendor?.isBankVerified,
        verifiedByAdmin: vendor?.isBankVerifiedByAdmin,
        status: vendor?.bankStatus
      },
      {
        id: 'aadhar',
        name: 'Aadhar Card',
        number: null,
        path: handleGetPath(vendor?.aadharPath),
        isVerified: false,
        verifiedByAdmin: false,
        status: null
      },
      {
        id: 'moa',
        name: 'MOA',
        number: null,
        path: handleGetPath(vendor?.moaPath),
        isVerified: false,
        verifiedByAdmin: false,
        status: null
      },
      {
        id: 'aoa',
        name: 'AOA',
        number: null,
        path: handleGetPath(vendor?.aoaPath),
        isVerified: false,
        verifiedByAdmin: false,
        status: null
      },
      {
        id: 'board',
        name: 'Board Resolution',
        number: null,
        path: handleGetPath(vendor?.boardResolutionPath),
        isVerified: false,
        verifiedByAdmin: false,
        status: null
      }
    ];

    const activeDoc = documents.find(doc => doc.id === activeDocTab);

    // Helper function to get status color
    const getStatusColor = (status: string | null) => {
      if (!status) return 'text-gray-600';
      switch (status.toLowerCase()) {
        case 'valid':
        case 'verified':
        case 'approved':
          return 'text-green-600';
        case 'invalid':
        case 'rejected':
        case 'failed':
          return 'text-red-600';
        case 'pending':
        case 'under_review':
          return 'text-yellow-600';
        default:
          return 'text-gray-600';
      }
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents Verification</h3>

        {/* Document Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 -mx-2 px-2">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveDocTab(doc.id)}
              className={`flex-shrink-0 px-4 py-2 mr-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeDocTab === doc.id
                  ? 'bg-teal-100 text-teal-700 border border-teal-200 shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {doc.name}
            </button>
          ))}
        </div>

        {/* Document Details - Two Column Layout */}
        {activeDoc && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Document Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-gray-900 text-lg">{activeDoc.name}</h4>
                  {renderVerificationStatus(
                    activeDoc.isVerified as boolean,
                    activeDoc.verifiedByAdmin as boolean,
                    activeDoc.status as string
                  )}
                </div>

                <div className="space-y-3">
                  {activeDoc.number && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Number:</span>
                      <span className="font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-md">
                        {activeDoc.number}
                      </span>
                    </div>
                  )}

                  {activeDoc.status && (
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`font-semibold px-3 py-1 rounded-md ${getStatusColor(activeDoc.status)} bg-gray-50`}>
                        {activeDoc.status.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Actions */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                <h5 className="font-medium text-gray-900 mb-3">Verification Actions</h5>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleVerifyDocument(activeDoc.id)}
                    disabled={activeDoc.verifiedByAdmin}
                    className="flex items-center space-x-2 px-4 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 border border-green-200 flex-1 justify-center"
                  >
                    {verifying === activeDoc.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <BadgeCheck className="w-4 h-4" />
                    )}
                    <span>Verify Document</span>
                  </button>

                  {activeDoc.verifiedByAdmin && (
                    <button
                      onClick={() => handleUnverifyDocument(activeDoc.id)}
                      disabled={verifying === activeDoc.id}
                      className="flex items-center space-x-2 px-4 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 border border-red-200 flex-1 justify-center"
                    >
                      {verifying === activeDoc.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <BadgeX className="w-4 h-4" />
                      )}
                      <span>Unverify</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Document Preview and Actions */}
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
              {activeDoc.path ? (
                <div className="space-y-5">
                  {/* Document Preview */}
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Document Preview
                    </h5>
                    <div className="flex justify-center items-center min-h-[200px] bg-white rounded-lg border-2 border-dashed border-gray-300">
                      <img
                        src={activeDoc.path}
                        alt={activeDoc.name}
                        className="max-w-full max-h-64 object-contain rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement;
                          if (fallback) {
                            fallback.innerHTML = `
                              <div class="text-center text-gray-500 py-8">
                                <FileText class="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                <p class="font-medium">Document preview not available</p>
                                <p class="text-sm text-gray-400 mt-1">Click download to view the file</p>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Document Actions */}
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Document Actions
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleDownloadDocument(activeDoc.path!, activeDoc.name)}
                        className="flex items-center space-x-2 px-4 py-3 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 justify-center"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>

                      <button
                        onClick={() => window.open(activeDoc.path!, '_blank')}
                        className="flex items-center space-x-2 px-4 py-3 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 justify-center"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open in New Tab</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="font-medium text-gray-600">Document not uploaded</p>
                  <p className="text-sm text-gray-400 mt-2">No document available for preview</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderField = (icon: React.ReactNode, label: string, field: keyof Vendor, type: string = "text") => (
    <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 py-3 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start space-x-3 min-w-[200px]">
        {icon}
        <label className="text-sm text-gray-700 font-medium pt-0.5">{label}</label>
      </div>
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type={type}
            value={(editForm as any)[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white"
          />
        ) : (
          <p className="text-gray-900 text-sm break-words bg-gray-50 px-3 py-2 rounded-md">
            {(vendor as any)[field] || (Array.isArray((vendor as any)[field]) ?
              (vendor as any)[field].join(', ') : 'N/A')}
          </p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 px-4 bg-gray-50 min-h-screen">
        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-teal-500" />
        <span className="ml-2 text-sm sm:text-base text-gray-600">Loading vendor details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white min-h-screen">
        <button
          onClick={onBack}
          className="mb-4 sm:mb-6 flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Back to Vendors</span>
        </button>

        <div className="text-center py-8 sm:py-12 bg-white rounded-lg border border-slate-50 p-6">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4 text-sm sm:text-base px-4">
            Error loading vendor details: {error}
          </p>
          <button
            onClick={fetchVendorDetails}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-slate-50 rounded-lg p-4 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Back to Vendors</span>
        </button>

        <div className="flex items-center space-x-3">
          {!vendor.isKycVerified && (
            <button
              onClick={handleVerifyKYC}
              disabled={verifying === 'kyc'}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 disabled:opacity-50 text-sm shadow-sm"
            >
              {verifying === 'kyc' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>Verify KYC</span>
            </button>
          )}

          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-2 disabled:opacity-50 text-sm shadow-sm"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? "Saving..." : "Save"}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-2 text-sm shadow-sm"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Vendor</span>
            </button>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center shadow-sm">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>Changes saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center shadow-sm">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Vendor Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-teal-100 p-3 rounded-lg">
            <Building2 className="w-8 h-8 text-teal-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {vendor.vendorName}
              </h1>
              {vendor.isKycVerified ? (
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  KYC Verified
                </span>
              ) : (
                <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                  KYC Pending
                </span>
              )}
              {vendor.isActive ? (
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-gray-600">Vendor ID: {vendor.vendorId}</p>
            <p className="text-sm text-gray-500">
              Created: {new Date(vendor.createdAt).toLocaleDateString()} | Last
              Updated: {new Date(vendor.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-teal-500" />
              Personal Information
            </h3>
            {renderField(<Mail className="w-4 h-4 text-teal-500" />, "Email", "email", "email")}
            {renderField(<Phone className="w-4 h-4 text-teal-500" />, "Mobile", "mobile", "tel")}
            {renderField(<Calendar className="w-4 h-4 text-teal-500" />, "Date of Birth", "dob", "date")}
            {renderField(<CreditCard className="w-4 h-4 text-teal-500" />, "PAN Number", "panNumber")}
            {renderField(<User className="w-4 h-4 text-teal-500" />, "PAN Name", "panName")}
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-teal-500" />
              Business Information
            </h3>
            {renderField(<Store className="w-4 h-4 text-teal-500" />, "Legal Name", "legalNameOfBusiness")}
            {renderField(<Store className="w-4 h-4 text-teal-500" />, "Trade Name", "tradeNameOfBusiness")}
            {renderField(<MapPin className="w-4 h-4 text-teal-500" />, "Business Address", "principalPlaceAddress")}
            {renderField(<Briefcase className="w-4 h-4 text-teal-500" />, "Constitution", "constitutionOfBusiness")}
            {renderField(<FileText className="w-4 h-4 text-teal-500" />, "Business Activities", "natureOfBusinessActivities")}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Registration Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileCheck className="w-5 h-5 mr-2 text-teal-500" />
              Registration Details
            </h3>
            {renderField(<CreditCard className="w-4 h-4 text-teal-500" />, "GSTIN", "gstin")}
            {renderField(<Building className="w-4 h-4 text-teal-500" />, "CIN Number", "cinNumber")}
            {renderField(<Building className="w-4 h-4 text-teal-500" />, "Company Name", "companyName")}
            {renderField(<Calendar className="w-4 h-4 text-teal-500" />, "Incorporation Date", "incorporationDate", "date")}
          </div>

          {/* Bank Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BanknoteIcon className="w-5 h-5 mr-2 text-teal-500" />
              Bank Details
            </h3>
            {renderField(<CreditCard className="w-4 h-4 text-teal-500" />, "Account Number", "accountNumber")}
            {renderField(<FileText className="w-4 h-4 text-teal-500" />, "IFSC Code", "ifscCode")}
            {renderField(<Building className="w-4 h-4 text-teal-500" />, "Bank Name", "bankName")}
            {renderField(<User className="w-4 h-4 text-teal-500" />, "Account Holder", "nameAtBank")}
            {renderField(<MapPin className="w-4 h-4 text-teal-500" />, "Bank Branch", "bankBranch")}
          </div>
        </div>
      </div>

      {/* Documents */}
      {renderDocumentSection()}

      {/* Additional Links */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {renderField(<Globe className="w-4 h-4 text-teal-500" />, "Website", "websiteLink")}
          {renderField(<Globe className="w-4 h-4 text-teal-500" />, "Mobile App", "mobileAppLink")}
          {renderField(<Briefcase className="w-4 h-4 text-teal-500" />, "Line of Business", "lineOfBusiness")}
          {renderField(<FileText className="w-4 h-4 text-teal-500" />, "Terms & Conditions", "termAndConditionUrl")}
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;