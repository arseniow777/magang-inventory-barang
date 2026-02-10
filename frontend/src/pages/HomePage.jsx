import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await api.get('/health');
      return response.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Inventory Management System
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Backend Connection Status</h2>
          
          {isLoading && (
            <p className="text-gray-600">Checking connection...</p>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-bold">Connection Error</p>
              <p className="text-sm">{error.message}</p>
              <p className="text-sm mt-2">Make sure backend is running on port 5000</p>
            </div>
          )}
          
          {data && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <p className="font-bold">{data.message}</p>
              <p className="text-sm">{data.timestamp}</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Setup Complete!</h3>
          <p className="text-blue-800 text-sm">
            Frontend dan Backend sudah terhubung. Silakan mulai development.
          </p>
        </div>
      </div>
    </div>
  );
}