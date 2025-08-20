import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// The Farmer interface should be defined here or imported from a shared file.
interface Farmer {
  id: string;
  name: string;
}

const FarmerList = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        // Make a fetch request to your backend API route
        const response = await fetch('http://localhost:5000/api/farmers');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch farmers: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Assuming your backend returns an array of farmers under a 'farmers' key
        if (data && data.farmers) {
          setFarmers(data.farmers);
        } else {
          setFarmers([]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch farmers data", err);
        setError("Could not load the list of farmers. Please ensure your backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-xl text-gray-600">Loading farmers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Available Farmers</h1>
      {farmers.length === 0 ? (
        <p className="text-center text-gray-500">No farmers found in the database.</p>
      ) : (
        <ul className="space-y-4 w-full max-w-sm">
          {farmers.map(farmer => (
            <li key={farmer.id}>
              <Link to={`/farmers/${farmer.id}`} className="block p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center text-lg font-semibold text-green-700">
                {farmer.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FarmerList;