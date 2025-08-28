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
  Wallet,
  X,
  Plus,
} from "lucide-react";
import apiClient from "../../../API/apiClient";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface Vendor {
  vendorId: string | number;
  vendorName: string;
  email?: string;
  mobileNumber?: string;
  role?: string;
}

interface SuccessToastProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

interface VendorListProps {
  onEditVendor: (vendorId: string | number) => void;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ isVisible, message, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 bg-green-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg flex items-center space-x-2 sm:space-x-3 max-w-full sm:max-w-md mx-auto sm:mx-0">
      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
      <span className="flex-1 text-sm sm:text-base break-words">{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:text-green-200 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const VendorList: React.FC<VendorListProps> = ({ onEditVendor }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [successToast, setSuccessToast] = useState<{ isVisible: boolean; message: string }>({ isVisible: false, message: "" });
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = Cookies.get("accessToken");
      console.log("Token from cookies:", token);

      const response = await apiClient("/vendor/get-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setVendors(response.data.data);
      } else {
        console.warn("API response.data is not an array:", response.data);
        setVendors([]);
        setError("Invalid data format received from server");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch vendors");
      console.error("Error fetching vendors:", err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = useMemo(() => {
    if (!searchTerm) return vendors;

    return vendors.filter((vendor) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        vendor.vendorName?.toLowerCase().includes(searchLower) ||
        vendor.email?.toLowerCase().includes(searchLower) ||
        vendor.mobileNumber?.toLowerCase().includes(searchLower) ||
        vendor.vendorId?.toString().toLowerCase().includes(searchLower)
      );
    });
  }, [vendors, searchTerm]);

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVendors = filteredVendors.slice(startIndex, Math.min(endIndex, filteredVendors.length));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12 px-4">
        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-teal-500" />
        <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading vendors...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12 px-4">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4 text-sm sm:text-base px-4">Error loading vendors: {error}</p>
          <button
            onClick={fetchVendors}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Vendor Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mb-2">
                Manage your vendor relationships and partnerships
              </p>
              <div className="space-y-1">
                <p className="text-teal-700 font-semibold text-sm sm:text-base">
                  Total Registered Vendors: {vendors.length}
                </p>
                {filteredVendors.length !== vendors.length && (
                  <p className="text-gray-600 text-sm sm:text-base">
                    Showing {filteredVendors.length} of {vendors.length} vendors
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => { navigate("/admin/vendor-registration") }}
              className="w-full lg:w-auto bg-teal-500 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg font-medium shadow-md hover:bg-teal-600 transition text-sm sm:text-base"
            >
              Add New Vendor
            </button>
          </div>
        </div>

        {/* Search and Controls - Only show if there are vendors */}
        {vendors.length > 0 && (
          <>
            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="relative max-w-full sm:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or mobile..."
                  className="block w-full pl-10 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base"
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      onClick={clearSearch}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded px-2 sm:px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>

              {filteredVendors.length > 0 && (
                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredVendors.length)} of {filteredVendors.length} entries
                </div>
              )}
            </div>
          </>
        )}

        {/* Vendor Cards */}
        <div className="space-y-4 sm:space-y-6">
          {currentVendors?.map((vendor) => (
            <div
              key={vendor.vendorId}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start mb-4">
                    <div className="bg-teal-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">
                        {vendor.vendorName}
                      </h3>
                      <div className="space-y-1 text-xs sm:text-sm text-gray-500">
                        <p>ID: {vendor.vendorId}</p>
                        <p>Type: {vendor.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700 text-xs sm:text-sm truncate">
                        {vendor.email || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700 text-xs sm:text-sm">
                        {vendor.mobileNumber || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 lg:ml-4">
                  <button
                    onClick={() => onEditVendor(vendor.vendorId)}
                    className="flex-1 lg:flex-none flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-xs sm:text-sm"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - Show when no vendors exist or search returns no results */}
        {vendors.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Building2 className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
              No Vendors Found
            </h3>
            <p className="text-gray-500 text-base sm:text-lg mb-6">
              Get started by adding your first vendor
            </p>
            <button
              onClick={() => navigate("/admin/vendor-registration")}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Add Your First Vendor
            </button>
          </div>
        ) : filteredVendors.length === 0 && searchTerm ? (
          <div className="text-center py-8 sm:py-12">
            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
              No Matching Vendors Found
            </h3>
            <p className="text-gray-500 text-base sm:text-lg mb-6">
              No vendors match your search criteria
            </p>
            <button
              onClick={clearSearch}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm sm:text-base"
            >
              Clear Search
            </button>
          </div>
        ) : null}

        {/* Pagination - Only show if there are vendors and more than one page */}
        {vendors.length > 0 && totalPages > 1 && (
          <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && handlePageChange(page)}
                disabled={page === "..."}
                className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${page === currentPage
                    ? "bg-teal-500 text-white"
                    : page === "..."
                      ? "text-gray-400 cursor-not-allowed bg-white"
                      : "border border-gray-300 text-gray-500 bg-white hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <SuccessToast
        isVisible={successToast.isVisible}
        message={successToast.message}
        onClose={() => setSuccessToast({ isVisible: false, message: "" })}
      />
    </>
  );
};

export default VendorList;