import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
}

interface PaymentGatewayCardProps {
  gateway: PaymentGateway;
  onEdit: () => void;
}

const PaymentGatewayCard: React.FC<PaymentGatewayCardProps> = ({
  gateway,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-72">
      {/* Image section - takes 80% height */}
      <div className="flex items-center justify-center bg-gray-50 h-4/5 w-full">
        <img
          src={gateway.logo}
          alt={gateway.name}
          className="h-full w-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' /%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* Content - takes remaining 20% */}
      <div className="flex items-center justify-between px-4 py-3 h-1/5">
        {/* Gateway name */}
        <h3 className="font-bold text-gray-900 text-lg truncate">
          {gateway.name}
        </h3>

        {/* Right arrow button */}
        <button
          className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors"
          onClick={onEdit}
        >
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PaymentGatewayCard;
