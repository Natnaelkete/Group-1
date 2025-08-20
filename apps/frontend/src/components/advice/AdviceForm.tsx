import React, { useState } from 'react';

// Main component for the agricultural advice application
const AdviceForm = () => {
  // State to hold form input values
  const [formData, setFormData] = useState({
    crop: '',
    region: '',
    problem: '',
    // Initialize a random user ID when the component loads
    userId: `user-${Math.random().toString(36).substring(2, 15)}`,
  });

  // State for managing UI feedback: loading, advice, and error messages
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle changes to form inputs and update the state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form behavior (page reload)
    setLoading(true);
    setAdvice('');
    setError('');

    // Check if any of the fields are empty
    // The userId is now generated, so we only need to check the other fields
    if (!formData.crop || !formData.region || !formData.problem) {
      setError("Please fill in all the fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The formData object now includes userId
        body: JSON.stringify(formData),
      });

      // Check for a successful response from the server
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get advice.');
      }

      const data = await response.json();
      setAdvice(data.advice); // Set the advice received from the server
    } catch (err: unknown) { // 'err' is now explicitly typed as 'unknown' for safety
      console.error('Error fetching advice:', err);
      // Safely access the message property by first checking the type
      if (err instanceof Error) {
        setError(err.message || 'An unexpected error occurred.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Agricultural Advice Chatbot</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="crop" className="text-sm font-medium text-gray-700 mb-1">
              Crop Name:
            </label>
            <input
              type="text"
              id="crop"
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              placeholder="e.g., Teff, Coffee"
              className="p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition duration-150"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="region" className="text-sm font-medium text-gray-700 mb-1">
              Region in Ethiopia:
            </label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="e.g., Oromia, Amhara"
              className="p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition duration-150"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="problem" className="text-sm font-medium text-gray-700 mb-1">
              Problem you're facing:
            </label>
            <textarea
              id="problem"
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              rows={4} // Corrected: 'rows' must be a number, not a string
              placeholder="e.g., 'Yellowing leaves and stunted growth' or 'Pest infestation'"
              className="p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition duration-150"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Getting Advice...' : 'Get Advice'}
          </button>
        </form>

        {/* Display sections for error and advice */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {advice && (
          <div className="mt-6 p-6 bg-gray-50 border-l-4 border-green-500 rounded-md shadow-inner">
            <h2 className="text-lg font-bold text-green-800 mb-2">Advice:</h2>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{advice}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdviceForm;
