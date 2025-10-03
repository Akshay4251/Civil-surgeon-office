import React, { useState } from "react";
import { Download, FileText } from "lucide-react";

// Import PDFs
import PDF1 from '../Pdf/2005-22.pdf';


// Sample data
const actsData = [
  { title: "RTI ACT, 2005", size: "4 MB", file: PDF1 },
];

export default function ActsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13; // ✅ 13 on page 1

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = actsData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(actsData.length / itemsPerPage);

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        RTI
      </h2>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-pink-600 text-white text-left">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">View / Download</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((act, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition duration-150">
                <td className="py-3 px-4">{act.title}</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4 flex items-center gap-4">
                  {/* View */}
                  <a
                    href={act.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <FileText className="w-4 h-4 mr-1" /> View
                  </a>

                  {/* Download */}
                  <a
                    href={act.file}
                    download
                    className="flex items-center text-green-600 hover:underline"
                  >
                    <Download className="w-4 h-4 mr-1" /> {act.size}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-pink-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div> */}

      <p className="mt-6 text-center text-gray-700">
        For Online Application,{" "}
        <a
          href="https://rtionline.maharashtra.gov.in/request/request.php?lan=E" // 👉 Replace with your actual link
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 font-semibold hover:underline"
        >
          click here
        </a>.
      </p>
    </section>
  );
}
