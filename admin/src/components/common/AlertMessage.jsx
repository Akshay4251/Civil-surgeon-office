// src/components/common/AlertMessage.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const AlertMessage = ({ error, success, setError, setSuccess }) => {
  if (!error && !success) return null;

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={() => setError("")} className="text-red-700 hover:text-red-900">
            <FaTimes />
          </button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <p className="text-sm">{success}</p>
          <button onClick={() => setSuccess("")} className="text-green-700 hover:text-green-900">
            <FaTimes />
          </button>
        </div>
      )}
    </>
  );
};

export default AlertMessage;