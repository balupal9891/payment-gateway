import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon,
  BellIcon,
  DocumentTextIcon,
  CreditCardIcon,
  Squares2X2Icon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const settingsCards = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      description: 'View and edit your user profile settings here.',
      icon: UserIcon,
      action: 'View & Edit',
      onClick: () => navigate('/settings/profile')
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'View and edit your notification settings here.',
      icon: BellIcon,
      action: 'View & Edit',
      onClick: () => navigate('/settings/notifications')
    },
    {
      id: 'webhooks',
      title: 'Webhooks',
      description: 'View and edit your webhooks settings here.',
      icon: DocumentTextIcon,
      action: 'View & Edit',
      onClick: () => navigate('/settings/webhooks')
    },
    {
      id: 'pg-integration',
      title: 'PG Integration Manager',
      description: 'View and edit your PG settings here.',
      icon: CreditCardIcon,
      action: 'View & Edit & Manage',
      link: '/settings/pg'
    },
    {
      id: 'platform-qr',
      title: 'Platform QR',
      description: 'View your QR settings here.',
      icon: Squares2X2Icon,
      action: 'View & Manage',
      link: '/settings/platform-qr'
    },
    {
      id: 'static-qr',
      title: 'Static QR',
      description: 'View your Static UPI QR settings here.',
      icon: Squares2X2Icon,
      action: 'View & Manage',
      link: '/settings/static-qr'
    },
    {
      id: 'network-firewall',
      title: 'Network FireWall',
      description: 'View your update your Network Firewall settings here.',
      icon: ShieldCheckIcon,
      action: 'View & Edit',
      onClick: () => navigate('/settings/network-firewall')
    }
  ];

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-lg text-gray-600">Your One-Stop Account Customization</p>
      </div>

      {/* Settings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {settingsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Card Icon */}
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-teal-500" />
              </div>

              {/* Card Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {card.description}
              </p>

              {/* Action Button/Link */}
              {card.onClick ? (
                <button
                  onClick={card.onClick}
                  className="inline-flex items-center text-teal-500 hover:text-teal-600 font-medium text-sm transition-colors duration-200 cursor-pointer"
                >
                  {card.action}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ) : (
                <a
                  href={card.link}
                  className="inline-flex items-center text-teal-500 hover:text-teal-600 font-medium text-sm transition-colors duration-200"
                >
                  {card.action}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SettingsPage;
