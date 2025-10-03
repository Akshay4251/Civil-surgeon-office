import React, { useState } from "react";
import { Download, FileText } from "lucide-react";

// Import PDFs
import PDF16 from '../Pdf/PDF16.pdf';
import PDF17 from '../Pdf/PDF17.pdf';
import PDF18 from '../Pdf/PDF18.pdf';
import PDF19 from '../Pdf/PDF19.pdf';
import PDF20 from '../Pdf/PDF20.pdf';
import PDF21 from '../Pdf/PDF21.pdf';


// Sample data
const actsData = [
  { title: "Clinical Establishment Act, 2010", size: "4 MB", file: PDF16 },
  { title: "Prevention and Control of Infectious and Contagious Diseases in Animals Act, 2009", size: "1 MB", file: PDF17 },
  { title: "Bio-Medical Waste Management Rules, 2016", size: "326 KB", file: PDF18 },
  { title: "Environment Protection Act, 1986", size: "336 KB", file: PDF19 },
  { title: "Epidemic Disease Act, 1897", size: "66 KB", file: PDF20 },
  { title: "Disaster Management Act, 2005", size: "381 KB", file: PDF21 },
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Central Government Acts
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
      <div className="flex justify-center mt-6 space-x-2">
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
      </div>
    </section>
  );
}
