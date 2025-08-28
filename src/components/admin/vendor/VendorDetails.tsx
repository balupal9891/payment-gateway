import React, { useState, useEffect, useMemo } from "react";
import {
  Edit,
  Building2,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Banknote,
  ChevronLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  Search,
  X,
  Save,
} from "lucide-react";
import apiClient from "../../../API/apiClient";
// import Layout from "../../utils/Layout";

// Define interfaces for the data structures
interface ProductPlan {
  name: string;
  region: string;
  planType: string;
  price: number;
  data: number;
  validity: number;
}

interface PlanCommission {
  localPlanId: string;
  portalCommissionRate: number;
  vendorCommissionRate: number;
  productPlan: ProductPlan;
}

interface Vendor {
  vendorId: string;
  vendorName: string;
  vendorAddress: string;
  email: string;
  mobileNumber: string;
  gstin: string;
  pan: string;
  remark: string;
  defaultPortalCommission: number;
  defaultVendorCommission: number;
  bankName: string;
  branchName: string;
  ifsc: string;
  accountNumber: string;
  planCommission?: PlanCommission[];
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
  
  // Plan commission pagination and search
  const [planSearchTerm, setPlanSearchTerm] = useState<string>("");
  const [currentPlanPage, setCurrentPlanPage] = useState<number>(1);
  const plansPerPage = 5;

  const fetchVendorDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient(`/vendor/get-by-id/${vendorId}`);

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
        gstin: editForm.gstin,
        pan: editForm.pan,
        remark: editForm.remark,
        defaultPortalCommission: editForm.defaultPortalCommission,
        defaultVendorCommission: editForm.defaultVendorCommission,
        bankName: editForm.bankName,
        branchName: editForm.branchName,
        ifsc: editForm.ifsc,
        accountNumber: editForm.accountNumber,
      };

      const response = await apiClient.patch('/vendor/update', updateData);

      if (response.data) {
        setVendor(editForm as Vendor);
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err : any) {
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

  // Filter and paginate plan commissions
  const filteredPlans = useMemo(() => {
    if (!vendor?.planCommission) return [];
    
    return vendor.planCommission.filter(commission =>
      commission.productPlan.name.toLowerCase().includes(planSearchTerm.toLowerCase()) ||
      commission.productPlan.region.toLowerCase().includes(planSearchTerm.toLowerCase()) ||
      commission.productPlan.planType.toLowerCase().includes(planSearchTerm.toLowerCase())
    );
  }, [vendor?.planCommission, planSearchTerm]);

  const paginatedPlans = useMemo(() => {
    const startIndex = (currentPlanPage - 1) * plansPerPage;
    return filteredPlans.slice(startIndex, startIndex + plansPerPage);
  }, [filteredPlans, currentPlanPage, plansPerPage]);

  const totalPlanPages = Math.ceil(filteredPlans.length / plansPerPage);

  useEffect(() => {
    if (vendorId) {
      fetchVendorDetails();
    }
  }, [vendorId]);

  useEffect(() => {
    setCurrentPlanPage(1);
  }, [planSearchTerm]);

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

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
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
          <span>Vendor details updated successfully!</span>
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
          {/* Basic and Tax Information - Stack on mobile, side by side on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Basic Information */}
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

            {/* Tax & Legal Information */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Tax & Legal Information
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {renderField(
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                  "GSTIN",
                  "gstin"
                )}
                {renderField(
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                  "PAN",
                  "pan"
                )}
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 sm:mb-6">
              Banking Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {renderField(
                <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                "Bank Name",
                "bankName"
              )}
              {renderField(
                <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                "Branch Name",
                "branchName"
              )}
              {renderField(
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                "IFSC Code",
                "ifsc"
              )}
              {renderField(
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                "Account Number",
                "accountNumber"
              )}
              {renderField(
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                "Default Portal Commission",
                "defaultPortalCommission"
              )}
              {renderField(
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 flex-shrink-0" />,
                "Default Vendor Commission",
                "defaultVendorCommission"
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

          {/* Plan Commissions */}
          {vendor.planCommission && vendor.planCommission.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Plan Commissions ({vendor.planCommission.length})
                </h2>
              </div>

              {/* Search Bar */}
              <div className="mb-4 sm:mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search plans by name, region, or type..."
                    value={planSearchTerm}
                    onChange={(e) => setPlanSearchTerm(e.target.value)}
                    className="pl-10 pr-10 py-2 sm:py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base"
                  />
                  {planSearchTerm && (
                    <button
                      onClick={() => setPlanSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Plans Grid */}
              <div className="space-y-3 sm:space-y-4">
                {paginatedPlans.map((commission) => (
                  <div
                    key={commission.localPlanId}
                    className="bg-gray-50 rounded-lg p-3 sm:p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {commission.productPlan.name}
                      </h3>
                      <span className="text-lg sm:text-xl font-bold text-teal-600">
                        ₹{commission.productPlan.price}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-500">Data:</span>
                        <p className="font-medium">
                          {commission.productPlan.data}GB
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Validity:</span>
                        <p className="font-medium">
                          {commission.productPlan.validity} days
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Portal Commission:</span>
                        <p className="font-medium text-blue-600">
                          {commission.portalCommissionRate}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Vendor Commission:</span>
                        <p className="font-medium text-green-600">
                          {commission.vendorCommissionRate}%
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center mt-3 gap-2">
                      <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs">
                        {commission.productPlan.region}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {commission.productPlan.planType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPlanPages > 1 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-gray-200 space-y-4 sm:space-y-0">
                  <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                    Showing {((currentPlanPage - 1) * plansPerPage) + 1} to{" "}
                    {Math.min(currentPlanPage * plansPerPage, filteredPlans.length)} of{" "}
                    {filteredPlans.length} plans
                  </div>
                  
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => setCurrentPlanPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPlanPage === 1}
                      className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-xs sm:text-sm"
                    >
                      Prev
                    </button>
                    
                    <div className="flex space-x-1">
                      {(() => {
                        const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;
                        const halfVisible = Math.floor(maxVisiblePages / 2);
                        
                        let startPage = Math.max(1, currentPlanPage - halfVisible);
                        let endPage = Math.min(totalPlanPages, startPage + maxVisiblePages - 1);
                        
                        if (endPage - startPage + 1 < maxVisiblePages) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }
                        
                        const pages = [];
                        
                        if (startPage > 1) {
                          pages.push(
                            <button key={1} onClick={() => setCurrentPlanPage(1)} 
                              className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">1</button>
                          );
                          if (startPage > 2) {
                            pages.push(<span key="start-ellipsis" className="px-1 sm:px-2 py-1 sm:py-2 text-gray-400 text-xs sm:text-sm">...</span>);
                          }
                        }
                        
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button key={i} onClick={() => setCurrentPlanPage(i)}
                              className={`px-2 sm:px-3 py-1 sm:py-2 border rounded-lg text-xs sm:text-sm ${
                                i === currentPlanPage 
                                  ? 'bg-teal-500 text-white border-teal-500' 
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}>
                              {i}
                            </button>
                          );
                        }
                        
                        if (endPage < totalPlanPages) {
                          if (endPage < totalPlanPages - 1) {
                            pages.push(<span key="end-ellipsis" className="px-1 sm:px-2 py-1 sm:py-2 text-gray-400 text-xs sm:text-sm">...</span>);
                          }
                          pages.push(
                            <button key={totalPlanPages} onClick={() => setCurrentPlanPage(totalPlanPages)}
                              className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">
                              {totalPlanPages}
                            </button>
                          );
                        }
                        
                        return pages;
                      })()}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPlanPage(prev => Math.min(prev + 1, totalPlanPages))}
                      disabled={currentPlanPage === totalPlanPages}
                      className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-xs sm:text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* No Results Message */}
              {filteredPlans.length === 0 && planSearchTerm && (
                <div className="text-center py-6 sm:py-8">
                  <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-sm sm:text-base">
                    No plans found matching "{planSearchTerm}"
                  </p>
                  <button
                    onClick={() => setPlanSearchTerm("")}
                    className="mt-2 text-teal-600 hover:text-teal-700 text-sm sm:text-base"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          )}
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