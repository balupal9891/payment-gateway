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
} from "lucide-react";
import apiClient from "../../../API/apiClient";
import axios from "axios";
import baseURL from "../../../API/baseUrl";
import { CheckmarkIcon } from "react-hot-toast";
// import Layout from "../../utils/Layout";

// Define interfaces for the data structures
interface KYCDocument {
  docId: string;
  docName: string;
  docNumber: string;
  docImage: string;
  docPath: string; // Base64 or URL
  isVerified: boolean;
}

interface Vendor {
  vendorId: string;
  vendorName: string;
  vendorAddress: string;
  email: string;
  mobileNumber: string;
  businessName: string;
  businessType: string;
  businessNature: string;
  domainName: string;
  remark: string;
  kycDocuments?: KYCDocument[];
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

  // KYC Document management
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [newDocument, setNewDocument] = useState<{
    docName: string;
    docNumber: string;
    docImage: File | null;
  }>({
    docName: '',
    docNumber: '',
    docImage: null
  });

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
        vendorAddress: editForm.vendorAddress,
        email: editForm.email,
        mobileNumber: editForm.mobileNumber,
        businessName: editForm.businessName,
        businessType: editForm.businessType,
        businessNature: editForm.businessNature,
        domainName: editForm.domainName,
        remark: editForm.remark,
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

  const handleInputChange = (field: keyof Vendor, value: string | number): void => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewDocument(prev => ({ ...prev, docImage: file }));
    }
  };

  const handleAddKYCDocument = async (): Promise<void> => {
    if (!newDocument.docName || !newDocument.docNumber || !newDocument.docImage) {
      setError("Please fill all document fields and upload an image");
      return;
    }

    try {
      setUploadingDoc(newDocument.docName);

      const formData = new FormData();
      formData.append('vendorId', vendorId);
      formData.append('docName', newDocument.docName);
      formData.append('docNumber', newDocument.docNumber);
      formData.append('docImage', newDocument.docImage);

      const response = await apiClient.post('/vendor/upload-doc', formData, {
        headers: { 'Content-Type': 'multipart/form-data', }
      });

      if (response.data) {
        // Refresh vendor details to show new document
        await fetchVendorDetails();
        setNewDocument({ docName: '', docNumber: '', docImage: null });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to add KYC document");
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleVerifyDocument = async (docId: string): Promise<void> => {
    try {
      const response = await apiClient.post(`/vendor/verify-doc/${docId}`, {
        vendorId: vendorId
      });
      console.log(response);
      if (response.data) {
        fetchVendorDetails()
      }
      // if (response.data) {
      //   // Update local state
      //   setVendor(prev => {
      //     if (!prev) return prev;
      //     return {
      //       ...prev,
      //       kycDocuments: prev.kycDocuments?.map(doc => 
      //         doc.docId === docId ? { ...doc, isVerified } : doc
      //       ) || []
      //     };
      //   });
      //   setSaveSuccess(true);
      //   setTimeout(() => setSaveSuccess(false), 2000);
      // }
    } catch (err: any) {
      setError(err.message || "Failed to update document verification");
    }
  };

  const handleDeleteDocument = async (docId: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const response = await apiClient.delete(`/vendor/delete-doc/${docId}`);

      if (response.data) {
        // Update local state
        setVendor(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            kycDocuments: prev.kycDocuments?.filter(doc => doc.docId !== docId) || []
          };
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete document");
    }
  };

  useEffect(() => {
    if (vendorId) {
      fetchVendorDetails();
    }
  }, [vendorId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 px-4">
        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-teal-500" />
        <span className="ml-2 text-sm sm:text-base text-gray-600">Loading vendor details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <button
          onClick={onBack}
          className="mb-4 sm:mb-6 flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Back to Vendors</span>
        </button>

        <div className="text-center py-8 sm:py-12">
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

  const renderField = (icon: React.ReactNode, label: string, field: keyof Vendor, type: string = "text") => (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
      <div className="flex items-center space-x-2 sm:space-x-3">
        {icon}
        <label className="text-sm text-gray-500 font-medium">{label}</label>
      </div>
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type={type}
            value={(editForm as any)[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base"
          />
        ) : (
          <p className="text-gray-900 text-sm sm:text-base break-words">{(vendor as any)[field] || 'N/A'}</p>
        )}
      </div>
    </div>
  );

  const docNames = [
    "Aadhaar Card",
    "pan",
    "Passport",
    "Driving License",
    "Voter ID",
    "Business License",
    "gst",
    "Bank Statement",
    "Other"
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Back Button - Hidden on mobile when editing (floating button used instead) */}
      <button
        onClick={onBack}
        className={`${isEditing ? 'hidden sm:flex' : 'flex'} items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm sm:text-base">Back to Vendors</span>
      </button>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center text-sm sm:text-base">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
          <span>Changes saved successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center text-sm sm:text-base">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center">
              <div className="bg-teal-100 p-3 sm:p-4 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                  {vendor.vendorName}
                </h1>
                <p className="text-sm sm:text-base text-gray-500">Vendor ID: {vendor.vendorId}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {renderField(
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                  "Email",
                  "email",
                  "email"
                )}
                {renderField(
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                  "Mobile Number",
                  "mobileNumber",
                  "tel"
                )}
                {renderField(
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                  "Address",
                  "vendorAddress"
                )}
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Business Information
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {renderField(
                  <Building className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                  "Business Name",
                  "businessName"
                )}
                {renderField(
                  <Store className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                  "Business Type",
                  "businessType"
                )}
                {renderField(
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                  "Business Nature",
                  "businessNature"
                )}
              </div>
            </div>
          </div>

          {/* Website URL Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 sm:mb-6">
              Website URL
            </h2>
            <div className="max-w-md">
              {renderField(
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                "Website URL",
                "domainName",
                "url"
              )}
            </div>
          </div>

          {/* Tax & Legal Information with KYC Documents */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 sm:mb-6">
              Tax & Legal Information
            </h2>

            {/* KYC Documents Section */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 text-teal-500 mr-2" />
                KYC Documents
              </h3>

              {/* Add New Document Form */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Document</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <select
                    value={newDocument.docName}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, docName: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  >
                    <option value="">Select Document Type</option>
                    {docNames.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Document Number"
                    value={newDocument.docNumber}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, docNumber: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  />

                  <div className="flex space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="document-upload"
                    />
                    <label
                      htmlFor="document-upload"
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      {newDocument.docImage ? 'File Selected' : 'Upload'}
                    </label>

                    <button
                      onClick={handleAddKYCDocument}
                      disabled={uploadingDoc !== null}
                      className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:opacity-50 text-sm flex items-center"
                    >
                      {uploadingDoc ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Add'
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Documents */}
              {vendor.kycDocuments && vendor.kycDocuments.length > 0 ? (
                <div className="space-y-3">
                  {vendor.kycDocuments.map((doc) => (
                    <div key={doc.docId} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{doc.docName}</span>
                            {doc.isVerified ? (
                              <ShieldCheck className="w-4 h-4 text-green-500" />
                            ) : (
                              <Shield className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">Document No: {doc.docNumber}</p>
                          <p className="text-xs text-gray-500">
                            Status: {doc.isVerified ?
                              <span className="text-green-600 font-medium">verified</span> :
                              <span className="text-yellow-600 font-medium">Pending Verification</span>
                            }
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          {doc.docImage && (
                            <img
                              src={doc.docImage}
                              alt={doc.docName}
                              className="w-12 h-12 object-cover rounded border"
                            />
                          )}

                          <div className="flex items-center space-x-2">
                            {doc.isVerified ? (
                              <CheckCircle size={24} className="text-green-500" />
                            ) : (
                              <button
                                onClick={() => handleVerifyDocument(doc.docId)}
                                className="px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200"
                              >
                                Verify
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => handleDeleteDocument(doc.docId)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No KYC documents uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              Remarks
            </h2>
            {isEditing ? (
              <textarea
                value={editForm.remark || ''}
                onChange={(e) => handleInputChange('remark', e.target.value)}
                rows={3}
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base"
                placeholder="Enter remarks..."
              />
            ) : (
              <p className="text-gray-700 bg-gray-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                {vendor.remark || 'No remarks'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Floating Back Button (only visible when editing) */}
      {isEditing && (
        <button
          onClick={onBack}
          className="fixed bottom-4 left-4 sm:hidden bg-teal-600 hover:bg-teal-700 text-white rounded-full p-3 shadow-lg transition-colors z-40"
          aria-label="Back to vendor list"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default VendorDetails;