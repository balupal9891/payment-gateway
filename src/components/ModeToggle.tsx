import React, { useState, useEffect, useRef } from 'react';
import { useMode } from '../store/slices/modeSlice';

const ModeToggle: React.FC = () => {
  const {mode, setMode} = useMode();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleModeChange = (mode: 'production' | 'test') => {
    setMode(mode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isProduction = mode === 'production';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Mode Display */}
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all duration-200 hover:opacity-80 ${
          isProduction
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        <div className={`w-2 h-2 rounded-full ${
          isProduction ? 'bg-green-500' : 'bg-yellow-500'
        }`}></div>
        <span className="text-sm font-medium">
          {isProduction ? 'Live Mode' : 'Test Mode'}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {/* Test Mode Option */}
            <button
              onClick={() => handleModeChange('test')}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 ${
                mode === 'test' ? 'bg-yellow-50' : ''
              }`}
            >
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Test Mode</span>
            </button>
            
            {/* Divider */}
            <div className="border-t border-gray-200"></div>
            
            {/* Live Mode Option */}
            <button
              onClick={() => handleModeChange('production')}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 ${
                mode === 'production' ? 'bg-green-50' : ''
              }`}
            >
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Live Mode</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeToggle;
