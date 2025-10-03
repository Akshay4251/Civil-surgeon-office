// src/components/admin/PerformanceReportsManager.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseclient";
import { FaSpinner, FaTrash, FaEye, FaFilePdf, FaFileWord, FaFile } from 'react-icons/fa';
import AlertMessage from '../common/AlertMessage';

const PerformanceReportsManager = ({ setError, setSuccess, error, success }) => {
  const [performanceReports, setPerformanceReports] = useState([]);
  const [newReport, setNewReport] = useState({
    title: '',
    selectedFile: null
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPerformanceReports();
  }, []);

  const fetchPerformanceReports = async () => {
    try {
      setLoading(true);
      setError("");
      
      const { data, error } = await supabase
        .from("performance_reports")
        .select("*")
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      
      setPerformanceReports(data || []);
    } catch (err) {
      console.error("Error fetching performance reports:", err);
      setError("Failed to load performance reports. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleReportFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid PDF or PowerPoint file");
      e.target.value = null;
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      e.target.value = null;
      return;
    }

    setError("");
    setNewReport(prev => ({ ...prev, selectedFile: file }));
  };

  const uploadPerformanceReport = async () => {
    setError("");
    setSuccess("");

    if (!newReport.selectedFile) {
      setError("Please select a file");
      return;
    }

    if (!newReport.title.trim()) {
      setError("Please provide a title for the report");
      return;
    }

    setUploading(true);

    try {
      const file = newReport.selectedFile;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `performance-reports/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      if (!publicUrl) throw new Error("Failed to get public URL for uploaded file");

      const { data: reportData, error: insertError } = await supabase
        .from("performance_reports")
        .insert([{
          title: newReport.title.trim(),
          file_url: publicUrl,
          file_name: file.name,
          file_type: fileExt.toLowerCase(),
          file_size: file.size,
          uploaded_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) {
        await supabase.storage.from("documents").remove([filePath]);
        throw new Error(`Database error: ${insertError.message}`);
      }

      setPerformanceReports([reportData, ...performanceReports]);
      setNewReport({ title: '', selectedFile: null });
      
      const fileInput = document.getElementById('report-file-input');
      if (fileInput) fileInput.value = null;
      
      setSuccess("Performance report uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error('Error uploading performance report:', err);
      setError(err.message || "Failed to upload report. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deletePerformanceReport = async (id, fileUrl) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    setError("");
    setSuccess("");

    try {
      const { error: dbError } = await supabase
        .from("performance_reports")
        .delete()
        .eq("id", id);

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      const urlParts = fileUrl.split('/');
      const bucketIndex = urlParts.indexOf('documents');
      if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
        const filePath = urlParts.slice(bucketIndex + 1).join('/');
        
        const { error: storageError } = await supabase.storage
          .from("documents")
          .remove([filePath]);
        
        if (storageError) {
          console.warn("Failed to delete file from storage:", storageError);
        }
      }

      setPerformanceReports(performanceReports.filter((report) => report.id !== id));
      setSuccess("Report deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error('Error deleting report:', err);
      setError(err.message || "Failed to delete report. Please try again.");
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" size={20} />;
      case 'pptx':
      case 'ppt':
        return <FaFileWord className="text-blue-500" size={20} />;
      default:
        return <FaFile className="text-gray-500" size={20} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  return (
    <>
      <AlertMessage error={error} success={success} setError={setError} setSuccess={setSuccess} />
      
      {/* Upload New Report Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Upload Performance Report</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Title *
            </label>
            <input
              type="text"
              value={newReport.title}
              onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
              disabled={uploading}
              placeholder="Enter report title (e.g., Monthly Performance Report - January 2024)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File (PDF or PowerPoint) *
            </label>
            <input
              id="report-file-input"
              type="file"
              accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              onChange={handleReportFileChange}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {newReport.selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {newReport.selectedFile.name} ({(newReport.selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <button
            onClick={uploadPerformanceReport}
            disabled={uploading}
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-md font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Uploading...
              </span>
            ) : (
              'Upload Report'
            )}
          </button>
        </div>
      </div>

      {/* Current Reports List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Current Performance Reports</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <FaSpinner className="animate-spin h-8 w-8 text-pink-600" />
          </div>
        ) : performanceReports.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No performance reports uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {performanceReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-pink-600">
                    {getFileIcon(report.file_type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.title}</p>
                    <p className="text-sm text-gray-600">{report.file_name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Uploaded: {new Date(report.uploaded_at).toLocaleDateString()} | 
                      Size: {formatFileSize(report.file_size)} |
                      Type: {report.file_type.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={report.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <FaEye size={12} />
                    View
                  </a>
                  <button
                    onClick={() => deletePerformanceReport(report.id, report.file_url)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors flex items-center gap-1"
                  >
                    <FaTrash size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PerformanceReportsManager;