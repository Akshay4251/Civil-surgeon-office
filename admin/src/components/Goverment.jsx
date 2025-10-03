import React, { useState } from "react";
import { Download, FileText } from "lucide-react";

// Import PDFs
import PDF1 from '../Pdf/PDF1.pdf';
import PDF2 from '../Pdf/PDF2.pdf';
import PDF3 from '../Pdf/PDF3.pdf';
import PDF4 from '../Pdf/PDF4.pdf';
import PDF5 from '../Pdf/PDF5.pdf';
import PDF6 from '../Pdf/PDF6.pdf';
import pdf7 from '../Pdf/pdf7.pdf';
import pdf8 from '../Pdf/pdf8.pdf';
import pdf9 from '../Pdf/pdf9.pdf';
import pdf10 from '../Pdf/pdf10.pdf';
import pdf11 from '../Pdf/pdf11.pdf';
import pdf12 from '../Pdf/pdf12.pdf';
import pdf13 from '../Pdf/pdf13.pdf';
import PDF14 from '../Pdf/PDF14.pdf';
import PDF15 from '../Pdf/PDF15.pdf';

// Sample data
const actsData = [
  { title: "Clinical Establishment Act, 2010", size: "4 MB", file: PDF1 },
  { title: "Prevention and Control of Infectious and Contagious Diseases in Animals Act, 2009", size: "1 MB", file: PDF2 },
  { title: "Bio-Medical Waste Management Rules, 2016", size: "326 KB", file: PDF3 },
  { title: "Environment Protection Act, 1986", size: "336 KB", file: PDF4 },
  { title: "Epidemic Disease Act, 1897", size: "66 KB", file: PDF5 },
  { title: "Disaster Management Act, 2005", size: "381 KB", file: PDF6 },
  { title: "Transplantation of Human Organs and Tissues Rules, 2014", size: "750 KB", file: pdf7 },
  { title: "Transplantation of Human Organs and Tissues Act, 1994", size: "1 MB", file: pdf8 },
  { title: "Assisted Reproductive Technology (Regulation) Act, 2021", size: "38 KB", file: pdf9 },
  { title: "Surrogacy Regulation Act, 2021", size: "443 KB", file: pdf10 },
  { title: "Medical Termination of Pregnancy (MTP) Act, 1971", size: "455 KB", file: pdf11 },
  { title: "The Rights of Persons with Disabilities Act, 2016", size: "14 KB", file: pdf12 },
  { title: "Mental Health Care Act, 2017", size: "5 MB", file: pdf13 },
  { title: "National Commission for Allied and Healthcare Professions Act 2021", size: "1 MB", file: PDF14 },
  { title: "Pre-Conception Pre-Natal Diagnostic Techniques Act, 1994", size: "2 MB", file: PDF15 },
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
