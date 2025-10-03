import React from "react";
import AdminSetupImage from "../assets/Public.jpg"; // adjust path if needed

const AdministrativeSetup = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="text-center py-10 bg-white">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Administrative Setup
      </h2>

      {/* Flowchart Image */}
      <div className="flex justify-center mb-6">
        <img
          src={AdminSetupImage}
          alt="Administrative Setup Flowchart"
          className="max-w-full h-auto border rounded-lg shadow-lg"
        />
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="bg-pink-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-pink-700 transition duration-200 print:hidden"
      >
        Print Chart
      </button>
    </section>
  );
};

export default AdministrativeSetup;
