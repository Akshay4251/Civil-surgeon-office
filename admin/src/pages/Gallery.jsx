// src/pages/Gallery.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';
import { 
  FaSpinner, 
  FaExclamationTriangle, 
  FaTimes, 
  FaImages, 
  FaChevronLeft, 
  FaChevronRight, 
  FaExpand,
  FaCalendar 
} from 'react-icons/fa';

const Gallery = () => {
  const [events, setEvents] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedEventImages, setSelectedEventImages] = useState([]);
  const [imageLoaded, setImageLoaded] = useState({});
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');

  useEffect(() => {
    fetchEventsAndImages();
  }, []);

  const fetchEventsAndImages = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false, nullsFirst: false });
      
      if (eventsError) throw eventsError;
      
      // Fetch gallery images with event details
      const { data: imagesData, error: imagesError } = await supabase
        .from('gallery_images')
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
      
      if (imagesError) throw imagesError;
      
      setEvents(eventsData || []);
      setImages(imagesData || []);
    } catch (err) {
      console.error('Error fetching gallery data:', err);
      setError('Failed to load gallery. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterImagesByEvent = (eventId) => {
    if (eventId === 'all') {
      return images;
    }
    return images.filter(img => img.event_id === eventId);
  };

  const openLightbox = (image, index, eventId = null) => {
    const filteredImages = eventId ? images.filter(img => img.event_id === eventId) : filterImagesByEvent(selectedEventFilter);
    const actualIndex = filteredImages.findIndex(img => img.id === image.id);
    
    setSelectedEventImages(filteredImages);
    setSelectedImage(image);
    setSelectedIndex(actualIndex);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedIndex(0);
    setSelectedEventImages([]);
  };

  const goToPrevious = () => {
    const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : selectedEventImages.length - 1;
    setSelectedIndex(prevIndex);
    setSelectedImage(selectedEventImages[prevIndex]);
  };

  const goToNext = () => {
    const nextIndex = selectedIndex < selectedEventImages.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(nextIndex);
    setSelectedImage(selectedEventImages[nextIndex]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, selectedIndex]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImageLoad = (imageId) => {
    setImageLoaded(prev => ({ ...prev, [imageId]: true }));
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
                  <p className="text-gray-700 font-semibold text-lg">Loading Gallery</p>
                  <p className="text-gray-500 text-sm mt-1">Please wait while we fetch the images...</p>
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
            <FaImages className="text-white" size={32} />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Photo Gallery</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            Explore our visual journey through memorable moments and important events from the Civil Surgeon Office, Sindhudurg
          </p>
        </div>

        {/* Event Filter */}
        {events.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Event:</label>
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-700"
              >
                <option value="all">All Events</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.event_name} {event.event_date && `(${formatDate(event.event_date)})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

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

        {/* Gallery Display */}
        {images.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-20 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-8">
              <FaImages className="text-gray-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Images Available</h3>
            <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
              The photo gallery is currently empty. Images will be displayed here once they are uploaded by the administration.
            </p>
          </div>
        ) : selectedEventFilter === 'all' ? (
          // Display all events with their images
          <div className="space-y-12">
            {events.map((event) => {
              const eventImages = images.filter(img => img.event_id === event.id);
              
              if (eventImages.length === 0) return null;
              
              return (
                <div key={event.id} className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.event_name}</h3>
                    {event.event_description && (
                      <p className="text-gray-600 mb-2">{event.event_description}</p>
                    )}
                    {event.event_date && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <FaCalendar className="mr-2" size={14} />
                        {formatDate(event.event_date)}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {eventImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 aspect-square"
                        onClick={() => openLightbox(image, index, event.id)}
                      >
                        <div className="relative w-full h-full overflow-hidden">
                          {!imageLoaded[image.id] && (
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                          )}
                          
                          <img
                            src={image.image_url}
                            alt={`${event.event_name} - Image ${index + 1}`}
                            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                              imageLoaded[image.id] ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => handleImageLoad(image.id)}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Image+Not+Found';
                              handleImageLoad(image.id);
                            }}
                          />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <div className="flex items-center justify-center">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                  <FaExpand className="text-white" size={14} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Display filtered images
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
            {(() => {
              const selectedEvent = events.find(e => e.id === selectedEventFilter);
              const filteredImages = filterImagesByEvent(selectedEventFilter);
              
              return (
                <>
                  {selectedEvent && (
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.event_name}</h3>
                      {selectedEvent.event_description && (
                        <p className="text-gray-600 mb-2">{selectedEvent.event_description}</p>
                      )}
                      {selectedEvent.event_date && (
                        <div className="flex items-center text-gray-500 text-sm">
                          <FaCalendar className="mr-2" size={14} />
                          {formatDate(selectedEvent.event_date)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {filteredImages.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No images found for this event.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {filteredImages.map((image, index) => (
                        <div
                          key={image.id}
                          className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 aspect-square"
                          onClick={() => openLightbox(image, index)}
                        >
                          <div className="relative w-full h-full overflow-hidden">
                            {!imageLoaded[image.id] && (
                              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                            )}
                            
                            <img
                              src={image.image_url}
                              alt={`Gallery image ${index + 1}`}
                              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                                imageLoaded[image.id] ? 'opacity-100' : 'opacity-0'
                              }`}
                              onLoad={() => handleImageLoad(image.id)}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Image+Not+Found';
                                handleImageLoad(image.id);
                              }}
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <div className="flex items-center justify-center">
                                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                    <FaExpand className="text-white" size={14} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 0 && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
              <FaImages className="text-pink-500 mr-2" size={16} />
              <span className="text-gray-700 font-semibold">
                {selectedEventFilter === 'all' 
                  ? `${images.length} Total Images across ${events.length} Events`
                  : `${filterImagesByEvent(selectedEventFilter).length} Images in this Event`
                }
              </span>
            </div>
          </div>
        )}

        {/* Lightbox Modal - Fixed 90vh height */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative w-full h-[90vh] max-w-7xl mx-auto">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              >
                <FaTimes size={20} />
              </button>

              {/* Navigation Buttons */}
              {selectedEventImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                  >
                    <FaChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                  >
                    <FaChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image Container with fixed height */}
              <div className="flex flex-col h-full">
                {/* Image Area */}
                <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={selectedImage.image_url}
                    alt={`Gallery image ${selectedIndex + 1}`}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl shadow-2xl"
                  />
                </div>
                
                {/* Image Info Footer */}
                <div className="bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                  <div className="max-w-4xl mx-auto text-center">
                    {selectedImage.events && (
                      <p className="text-white text-lg font-bold mb-2">
                        {selectedImage.events.event_name}
                      </p>
                    )}
                    <p className="text-white/90 text-md font-medium mb-2">
                      Image {selectedIndex + 1} of {selectedEventImages.length}
                    </p>
                    <p className="text-white/70 text-sm">
                      Uploaded on {formatDate(selectedImage.uploaded_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Dots */}
              {selectedEventImages.length > 1 && selectedEventImages.length <= 20 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                  {selectedEventImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedIndex(index);
                        setSelectedImage(selectedEventImages[index]);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === selectedIndex 
                          ? 'bg-white scale-125' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
        
        .aspect-square {
          aspect-ratio: 1 / 1;
        }
        
        @media (max-width: 768px) {
          .aspect-square {
            aspect-ratio: 1 / 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Gallery;