// src/pages/PerformanceReport.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';
import { FaDownload, FaEye, FaFilePdf, FaFileWord, FaSpinner, FaExclamationTriangle, FaFileAlt } from 'react-icons/fa';

const PerformanceReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('performance_reports')
        .select('*')
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      
      setReports(data || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load performance reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (fileUrl, fileName) => {
    window.open(fileUrl, '_blank');
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file. Please try again.');
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className="text-red-400" size={24} />;
      case 'pptx':
      case 'ppt':
        return <FaFileWord className="text-blue-400" size={24} />;
      default:
        return <FaFileAlt className="text-gray-400" size={24} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-300 rounded-full animate-spin animation-delay-150"></div>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 font-semibold text-lg">Loading Performance Reports</p>
                  <p className="text-gray-500 text-sm mt-1">Please wait while we fetch the documents...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full mb-8 shadow-lg">
            <FaFileAlt className="text-white" size={32} />
          </div>    
          <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">Performance Reports</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            Access and download official performance reports and presentations from the Civil Surgeon Office, Sindhudurg
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="text-red-500" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-red-800 font-semibold">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {reports.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-8">
                <FaFileAlt className="text-gray-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Reports Available</h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                Performance reports will be displayed here once they are uploaded by the administration.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-pink-500 to-pink-600">
                  <div className="grid grid-cols-12 gap-6 px-8 py-5">
                    <div className="col-span-1 text-center">
                      <span className="text-white font-semibold text-sm uppercase tracking-wide">Type</span>
                    </div>
                    <div className="col-span-5">
                      <span className="text-white font-semibold text-sm uppercase tracking-wide">Document Title</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-white font-semibold text-sm uppercase tracking-wide">Upload Date</span>
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="text-white font-semibold text-sm uppercase tracking-wide">Size</span>
                    </div>
                    <div className="col-span-3 text-center">
                      <span className="text-white font-semibold text-sm uppercase tracking-wide">Actions</span>
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                  {reports.map((report, index) => (
                    <div 
                      key={report.id} 
                      className="grid grid-cols-12 gap-6 px-8 py-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-pink-50 transition-all duration-300"
                    >
                      {/* File Type Icon */}
                      <div className="col-span-1 flex justify-center items-center">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          {getFileIcon(report.file_type)}
                        </div>
                      </div>

                      {/* Title */}
                      <div className="col-span-5 flex items-center">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate text-lg">
                            {report.title}
                          </h3>
                          <p className="text-sm text-gray-500 truncate mt-1">
                            {report.file_name}
                          </p>
                        </div>
                      </div>

                      {/* Upload Date */}
                      <div className="col-span-2 flex items-center justify-center">
                        <span className="text-sm text-gray-700 font-medium bg-gray-100 px-3 py-1 rounded-full">
                          {formatDate(report.uploaded_at)}
                        </span>
                      </div>

                      {/* File Size */}
                      <div className="col-span-1 flex items-center justify-center">
                        <span className="text-sm text-gray-700 font-medium">
                          {formatFileSize(report.file_size)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-3 flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleView(report.file_url, report.file_name)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium text-sm rounded-xl hover:from-blue-100 hover:to-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                          title="View File"
                        >
                          <FaEye size={14} className="mr-2" />
                          View
                        </button>
                        
                        <button
                          onClick={() => handleDownload(report.file_url, report.file_name)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-medium text-sm rounded-xl hover:from-green-100 hover:to-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                          title="Download File"
                        >
                          <FaDownload size={14} className="mr-2" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {reports.map((report) => (
                  <div key={report.id} className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-pink-50 transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
                        {getFileIcon(report.file_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3 truncate">
                          {report.file_name}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                          <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                            <span className="font-medium">Date:</span>
                            <span className="ml-1">{formatDate(report.uploaded_at)}</span>
                          </span>
                          <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                            <span className="font-medium">Size:</span>
                            <span className="ml-1">{formatFileSize(report.file_size)}</span>
                          </span>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleView(report.file_url, report.file_name)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium text-sm rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
                          >
                            <FaEye size={14} className="mr-2" />
                            View
                          </button>
                          
                          <button
                            onClick={() => handleDownload(report.file_url, report.file_name)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-medium text-sm rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300"
                          >
                            <FaDownload size={14} className="mr-2" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Note */}
        {reports.length > 0 && (
          <div className="mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">i</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-blue-900 font-semibold mb-2 text-lg">Important Note</p>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    These performance reports are official documents from the Civil Surgeon Office, Sindhudurg. 
                    For any queries, clarifications, or assistance regarding these documents, please contact the office administration 
                    during working hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Counter */}
        {reports.length > 0 && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
              <FaFileAlt className="text-pink-500 mr-2" size={16} />
              <span className="text-gray-700 font-semibold">
                {reports.length} {reports.length === 1 ? 'Document' : 'Documents'} Available
              </span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
      `}</style>
    </div>
  );
};

export default PerformanceReport;