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
// import { Navigate, useNavigate } from "react-router-dom";
// import Layout from "../../utils/Layout";
import VendorDetails from "./VendorDetails";
import VendorList from "./VendorList";

// Success Toast Component with responsive design
interface SuccessToastProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
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
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Main Component with responsive design
const VendorManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<"list" | "edit">("list");
  const [selectedVendorId, setSelectedVendorId] = useState<any>(null);

  const handleEditVendor = (vendorId: string | number) => {
    setSelectedVendorId(vendorId);
    console.log("Selected Vendor ID:", vendorId);
    setCurrentView("edit");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedVendorId(null);
  };

  return (
      <div className="min-h-screen bg-white">
        {/* Container with responsive padding and spacing */}
        <div className="w-full max-w-full overflow-x-hidden">
          {currentView === "list" ? (
            <div className="px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
              <VendorList onEditVendor={handleEditVendor} />

            </div>
          ) : (
            <div className="px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
              <VendorDetails 
                vendorId={selectedVendorId as string} 
                onBack={handleBackToList} 
              />
            </div>
          )}
        </div>

        {/* Mobile-friendly floating back button for details view */}
        {currentView === "edit" && (
          <button
            onClick={handleBackToList}
            className="fixed bottom-4 left-4 md:hidden bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors z-40"
            aria-label="Back to vendor list"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>
  );
};

export default VendorManagement;