// src/components/admin/GalleryManager.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseclient";
import { 
  FaSpinner, FaTrash, FaEye, FaPlus, FaSave, 
  FaTimes, FaCalendar 
} from 'react-icons/fa';
import AlertMessage from '../common/AlertMessage';

const GalleryManager = ({ setError, setSuccess, error, success }) => {
  const [events, setEvents] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: ''
  });
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchGalleryImages();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      setError("");
      
      const { data, error } = await supabase
        .from("gallery_images")
        .select(`
          *,
          events (
            id,
            event_name,
            event_description,
            event_date
          )
        `)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      
      setGalleryImages(data || []);
    } catch (err) {
      console.error("Error fetching gallery images:", err);
      setError("Failed to load gallery images. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async () => {
    setError("");
    setSuccess("");

    if (!newEvent.name.trim()) {
      setError("Please provide an event name");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("events")
        .insert([{
          event_name: newEvent.name.trim(),
          event_description: newEvent.description.trim(),
          event_date: newEvent.date || null
        }])
        .select()
        .single();

      if (error) throw error;

      setEvents([data, ...events]);
      setSelectedEvent(data.id);
      setNewEvent({ name: '', description: '', date: '' });
      setShowNewEventForm(false);
      setSuccess("Event created successfully!");
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message || "Failed to create event. Please try again.");
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event and all its images?")) return;

    setError("");
    setSuccess("");

    try {
      const { data: imagesToDelete, error: fetchError } = await supabase
        .from("gallery_images")
        .select("image_url")
        .eq("event_id", eventId);

      if (fetchError) throw fetchError;

      const { error: deleteError } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (deleteError) throw deleteError;

      if (imagesToDelete && imagesToDelete.length > 0) {
        for (const img of imagesToDelete) {
          const urlParts = img.image_url.split('/');
          const bucketIndex = urlParts.indexOf('images');
          if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
            const filePath = urlParts.slice(bucketIndex + 1).join('/');
            await supabase.storage.from("images").remove([filePath]);
          }
        }
      }

      setEvents(events.filter(e => e.id !== eventId));
      setGalleryImages(galleryImages.filter(img => img.event_id !== eventId));
      if (selectedEvent === eventId) setSelectedEvent('');
      
      setSuccess("Event and all associated images deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.message || "Failed to delete event. Please try again.");
    }
  };

  const handleGalleryFilesChange = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError(`${file.name} is not a valid image file`);
        return false;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError(`${file.name} exceeds 5MB size limit`);
        return false;
      }
      
      return true;
    });

    setGalleryFiles(validFiles);
    if (validFiles.length > 0) {
      setError("");
    }
  };

  const uploadGalleryImages = async () => {
    setError("");
    setSuccess("");

    if (!selectedEvent) {
      setError("Please select an event or create a new one");
      return;
    }

    if (galleryFiles.length === 0) {
      setError("Please select at least one image");
      return;
    }

    setUploading(true);
    let uploadedCount = 0;

    try {
      for (const file of galleryFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });

        if (uploadError) {
          console.error(`Failed to upload ${file.name}:`, uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        const { error: insertError } = await supabase
          .from("gallery_images")
          .insert([{
            event_id: selectedEvent,
            image_url: publicUrl,
            file_name: file.name,
            file_size: file.size
          }]);

        if (insertError) {
          console.error(`Failed to save ${file.name} to database:`, insertError);
          await supabase.storage.from("images").remove([filePath]);
          continue;
        }

        uploadedCount++;
      }

      if (uploadedCount > 0) {
        setGalleryFiles([]);
        const fileInput = document.getElementById('gallery-files-input');
        if (fileInput) fileInput.value = null;
        
        await fetchGalleryImages();
        
        setSuccess(`Successfully uploaded ${uploadedCount} image(s)!`);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to upload any images. Please try again.");
      }

    } catch (err) {
      console.error('Error uploading gallery images:', err);
      setError(err.message || "Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteGalleryImage = async (id, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    setError("");
    setSuccess("");

    try {
      const { error: dbError } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.indexOf('images');
      if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
        const filePath = urlParts.slice(bucketIndex + 1).join('/');
        
        const { error: storageError } = await supabase.storage
          .from("images")
          .remove([filePath]);
        
        if (storageError) {
          console.warn("Failed to delete image from storage:", storageError);
        }
      }

      setGalleryImages(galleryImages.filter((image) => image.id !== id));
      setSuccess("Image deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error('Error deleting gallery image:', err);
      setError(err.message || "Failed to delete image. Please try again.");
    }
  };

  return (
    <>
      <AlertMessage error={error} success={success} setError={setError} setSuccess={setSuccess} />
      
      {/* Event Selection and Creation */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Event Management</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Event for Gallery Upload
            </label>
            <div className="flex gap-2">
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">-- Select an Event --</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.event_name} {event.event_date && `(${new Date(event.event_date).toLocaleDateString()})`}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowNewEventForm(!showNewEventForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaPlus size={14} />
                New Event
              </button>
            </div>
          </div>

          {showNewEventForm && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-3">Create New Event</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter event name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter event description"
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={createEvent}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <FaSave size={14} />
                    Create Event
                  </button>
                  <button
                    onClick={() => {
                      setShowNewEventForm(false);
                      setNewEvent({ name: '', description: '', date: '' });
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <FaTimes size={14} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Gallery Images */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Upload Gallery Images</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Images (Multiple Selection Allowed)
            </label>
            <input
              id="gallery-files-input"
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleGalleryFilesChange}
              disabled={uploading || !selectedEvent}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {!selectedEvent && (
              <p className="mt-1 text-sm text-amber-600">
                Please select an event first before uploading images
              </p>
            )}
            {galleryFiles.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {galleryFiles.length} file(s) - Total size: {(galleryFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>

          <button
            onClick={uploadGalleryImages}
            disabled={uploading || !selectedEvent || galleryFiles.length === 0}
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-md font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Uploading Images...
              </span>
            ) : (
              'Upload Images to Event'
            )}
          </button>
        </div>
      </div>

      {/* Events and Gallery Images List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Events & Gallery Images</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <FaSpinner className="animate-spin h-8 w-8 text-pink-600" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No events created yet. Create an event to start uploading images.</p>
        ) : (
          <div className="space-y-6">
            {events.map((event) => {
              const eventImages = galleryImages.filter(img => img.event_id === event.id);
              
              return (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{event.event_name}</h3>
                      {event.event_description && (
                        <p className="text-gray-600 text-sm mt-1">{event.event_description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        {event.event_date && (
                          <span className="flex items-center gap-1">
                            <FaCalendar size={12} />
                            {new Date(event.event_date).toLocaleDateString()}
                          </span>
                        )}
                        <span>{eventImages.length} image(s)</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors flex items-center gap-1"
                    >
                      <FaTrash size={12} />
                      Delete Event
                    </button>
                  </div>
                  
                  {eventImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {eventImages.map((image) => (
                        <div
                          key={image.id}
                          className="group relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 bg-white aspect-square"
                        >
                          <img
                            src={image.image_url}
                            alt={`Gallery image`}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200x200?text=Error';
                            }}
                          />
                          
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                              <a
                                href={image.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                                title="View Image"
                              >
                                <FaEye size={12} />
                              </a>
                              <button
                                onClick={() => deleteGalleryImage(image.id, image.image_url)}
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                                title="Delete Image"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm py-4 text-center bg-gray-50 rounded">
                      No images uploaded for this event yet
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default GalleryManager;