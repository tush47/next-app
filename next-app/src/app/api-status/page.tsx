'use client';

import { useState, useEffect } from 'react';
import { testApiConnection, testEndpoints } from '@/utils/apiTest';
import { API_CONFIG } from '@/config/api';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ApiStatusPage() {
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [endpointStatus, setEndpointStatus] = useState<{
    endpoint: string;
    status: 'ok' | 'error';
    message: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      setLoading(true);
      try {
        const [connectionResult, endpointsResult] = await Promise.all([
          testApiConnection(),
          testEndpoints()
        ]);
        setConnectionStatus(connectionResult);
        setEndpointStatus(endpointsResult);
      } catch (error) {
        setConnectionStatus({
          success: false,
          message: 'Failed to test connection'
        });
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">API Connection Status</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Backend Configuration</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Base URL:</strong> {API_CONFIG.BASE_URL}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Timeout:</strong> {API_CONFIG.TIMEOUT}ms
              </p>
              <p className="text-sm text-gray-600">
                <strong>Mock Fallback:</strong> {API_CONFIG.USE_MOCK_FALLBACK ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Testing connection...</p>
            </div>
          ) : (
            <>
              {/* Connection Status */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Connection Status</h2>
                {connectionStatus && (
                  <div className={`flex items-center p-4 rounded-lg ${
                    connectionStatus.success 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    {connectionStatus.success ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
                    ) : (
                      <XCircleIcon className="w-6 h-6 text-red-600 mr-3" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        connectionStatus.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {connectionStatus.success ? 'Connected' : 'Connection Failed'}
                      </p>
                      <p className={`text-sm ${
                        connectionStatus.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {connectionStatus.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Endpoint Status */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Endpoint Status</h2>
                <div className="space-y-2">
                  {endpointStatus.map((endpoint) => (
                    <div key={endpoint.endpoint} className={`flex items-center p-3 rounded-lg ${
                      endpoint.status === 'ok' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      {endpoint.status === 'ok' ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-600 mr-3" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium ${
                          endpoint.status === 'ok' ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {endpoint.endpoint}
                        </p>
                        <p className={`text-sm ${
                          endpoint.status === 'ok' ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {endpoint.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Troubleshooting</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Make sure your backend is running on localhost:5000</li>
                  <li>• Check that your backend has the required endpoints (/users, /groups, /expenses, /settlements)</li>
                  <li>• Ensure CORS is properly configured on your backend</li>
                  <li>• If connection fails, the app will fall back to mock data</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 