import React from 'react';

export const CheckmarkIcon = ({ 
  size = 24, 
  color = '#6BC14A', 
  strokeWidth = 3,
  className = '' 
}: {
    size: number,
    color: string,
    strokeWidth: number,
    className: string
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Checkmark */}
      <path
        d="M8 12.5l2.5 2.5L16 9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

// Example usage component
// const IconDemo = () => {
//   return (
//     <div className="flex flex-col items-center space-y-6 p-8">
//       <h2 className="text-2xl font-bold text-gray-800">Checkmark Icon</h2>
      
//       {/* Different sizes */}
//       <div className="flex items-center space-x-4">
//         <CheckmarkIcon size={16} />
//         <CheckmarkIcon size={24} />
//         <CheckmarkIcon size={32} />
//         <CheckmarkIcon size={48} />
//       </div>
      
//       {/* Different colors */}
//       <div className="flex items-center space-x-4">
//         <CheckmarkIcon color="#6BC14A" />
//         <CheckmarkIcon color="#2563EB" />
//         <CheckmarkIcon color="#DC2626" />
//         <CheckmarkIcon color="#7C3AED" />
//       </div>
      
//       {/* Different stroke widths */}
//       <div className="flex items-center space-x-4">
//         <CheckmarkIcon strokeWidth={2} />
//         <CheckmarkIcon strokeWidth={3} />
//         <CheckmarkIcon strokeWidth={4} />
//       </div>
      
//       {/* Usage examples */}
//       <div className="flex flex-col space-y-4 mt-8">
//         <div className="flex items-center space-x-2">
//           <CheckmarkIcon size={20} />
//           <span className="text-gray-700">Task completed</span>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <CheckmarkIcon size={20} color="#2563EB" />
//           <span className="text-gray-700">Verified account</span>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <CheckmarkIcon size={20} color="#DC2626" />
//           <span className="text-gray-700">Important milestone</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IconDemo;