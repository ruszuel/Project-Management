import React from 'react';

const DateErrorModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-red-600">Invalid Date Range</h2>
        <p className="text-sm text-gray-700 mt-2">{message}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md" 
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DateErrorModal;
