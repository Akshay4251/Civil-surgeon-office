// src/components/admin/HeroSliderManager.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseclient";
import { FaSpinner, FaTrash, FaTimes } from 'react-icons/fa';
import AlertMessage from '../common/AlertMessage';

const HeroSliderManager = ({ setError, setSuccess, error, success }) => {
  const [slides, setSlides] = useState([]);
  const [newSlide, setNewSlide] = useState({
    title: { en: "", mr: "", hi: "" },
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError("");
      
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      setSlides(data || []);
    } catch (err) {
      console.error("Error fetching slides:", err);
      setError("Failed to load slides. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    const { name, value } = e.target;
    setNewSlide(prev => ({ 
      ...prev, 
      title: { ...prev.title, [name]: value } 
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      e.target.value = null;
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      e.target.value = null;
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  const addSlide = async () => {
    setError("");
    setSuccess("");

    if (!selectedFile) {
      setError("Please select an image file");
      return;
    }

    if (!newSlide.title.en.trim()) {
      setError("Please provide at least an English title");
      return;
    }

    setUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `slides/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("hero-images")
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: selectedFile.type
        });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from("hero-images")
        .getPublicUrl(filePath);

      if (!publicUrl) throw new Error("Failed to get public URL for uploaded image");

      const { data: slideData, error: insertError } = await supabase
        .from("hero_slides")
        .insert([{ 
          image_url: publicUrl, 
          title: newSlide.title,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) {
        await supabase.storage.from("hero-images").remove([filePath]);
        throw new Error(`Database error: ${insertError.message}`);
      }

      setSlides([...slides, slideData]);
      setNewSlide({ title: { en: "", mr: "", hi: "" } });
      setSelectedFile(null);
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = null;
      
      setSuccess("Slide added successfully!");
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error('Error adding slide:', err);
      setError(err.message || "Failed to add slide. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteSlide = async (id, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    setError("");
    setSuccess("");

    try {
      const { error: dbError } = await supabase
        .from("hero_slides")
        .delete()
        .eq("id", id);

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.indexOf('hero-images');
      if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
        const filePath = urlParts.slice(bucketIndex + 1).join('/');
        
        const { error: storageError } = await supabase.storage
          .from("hero-images")
          .remove([filePath]);
        
        if (storageError) {
          console.warn("Failed to delete image from storage:", storageError);
        }
      }

      setSlides(slides.filter((slide) => slide.id !== id));
      setSuccess("Slide deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error('Error deleting slide:', err);
      setError(err.message || "Failed to delete slide. Please try again.");
    }
  };

  return (
    <>
      <AlertMessage error={error} success={success} setError={setError} setSuccess={setSuccess} />
      
      {/* Add New Slide Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Slide</h2>
        
        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image *
            </label>
            <input 
              id="file-input"
              type="file" 
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Title Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (English) *
              </label>
              <input 
                type="text" 
                name="en" 
                value={newSlide.title.en} 
                onChange={handleTitleChange}
                disabled={uploading}
                placeholder="Enter English title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Marathi)
              </label>
              <input 
                type="text" 
                name="mr" 
                value={newSlide.title.mr} 
                onChange={handleTitleChange}
                disabled={uploading}
                placeholder="मराठी शीर्षक प्रविष्ट करा"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Hindi)
              </label>
              <input 
                type="text" 
                name="hi" 
                value={newSlide.title.hi} 
                onChange={handleTitleChange}
                disabled={uploading}
                placeholder="हिंदी शीर्षक दर्ज करें"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            onClick={addSlide} 
            disabled={uploading}
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-md font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Uploading...
              </span>
            ) : (
              'Add Slide'
            )}
          </button>
        </div>
      </div>

      {/* Current Slides List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Current Slides</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <FaSpinner className="animate-spin h-8 w-8 text-pink-600" />
          </div>
        ) : slides.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No slides added yet.</p>
        ) : (
          <div className="space-y-3">
            {slides.map((slide) => (
              <div 
                key={slide.id} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={slide.image_url} 
                    alt={slide.title.en || 'Slide image'} 
                    className="w-20 h-14 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x56?text=Error';
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {slide.title.en || '(No English title)'}
                    </p>
                    {slide.title.mr && (
                      <p className="text-sm text-gray-600">{slide.title.mr}</p>
                    )}
                    {slide.title.hi && (
                      <p className="text-sm text-gray-600">{slide.title.hi}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      ID: {slide.id}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteSlide(slide.id, slide.image_url)}
                  className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors flex items-center gap-1"
                >
                  <FaTrash size={12} />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HeroSliderManager;