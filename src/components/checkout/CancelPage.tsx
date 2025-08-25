import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useMode } from '../../store/slices/modeSlice';

export default function CancelledPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {mode} = useMode();
  // Extract session_id from URL query parameters if available
  const query = new URLSearchParams(location.search);
  const sessionId = query.get('session_id');

  useEffect(() => {
    // if (!sessionId) {
    //   navigate('/');
    // }
    
    // You might want to log cancelled payments for analytics
    console.log('Payment cancelled. Session ID:', sessionId);
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-3 text-3xl font-extrabold text-gray-900">
            Payment Cancelled
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your payment was not completed.
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Order Details
              </h3>
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Session ID:</span>
                  <span className="text-gray-900 font-mono text-sm">{sessionId}</span>
                </div>
                                 <div className="flex justify-between py-2">
                   <span className="text-gray-600">Mode:</span>
                   <span className={`font-medium ${mode === 'production' ? 'text-green-600' : 'text-yellow-600'}`}>
                     {mode === 'production' ? 'Live Mode' : 'Test Mode'}
                   </span>
                 </div>
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className="text-red-600 font-medium">Cancelled</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-blue-800">
                Need Help?
              </h4>
              <p className="mt-1 text-sm text-blue-700">
                If this was a mistake, you can try the payment again.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => navigate('/checkout')} // Adjust to your checkout route
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Retry Payment
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}