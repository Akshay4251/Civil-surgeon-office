// src/pages/SindhudurgHospitalsPage.jsx
import React, { useState, useEffect } from "react";
import { 
  FaPhone, 
  FaGlobe, 
  FaMapMarkerAlt, 
  FaBed, 
  FaHospital,
  FaUserMd,
  FaAmbulance,
  FaTimes,
  FaStethoscope,
  FaChevronRight,
  FaHeartbeat,
  FaClinicMedical,
  FaNotesMedical
} from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";
import { supabase } from '../supabaseclient';

// Hospital Detail Modal Component
// Hospital Detail Modal Component - Updated with transparent background
function HospitalDetailModal({ hospital, isOpen, onClose }) {
  if (!isOpen || !hospital) return null;

  // Helper function to check if field has valid data
  const hasValidData = (field) => {
    return field && field !== '' && field !== '#' && field !== 'null';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Transparent Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur rounded-full p-2.5 hover:bg-pink-50 transition-colors shadow-lg group"
          >
            <FaTimes className="w-5 h-5 text-gray-600 group-hover:text-pink-600" />
          </button>

          {/* Header with hospital image */}
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
            {hasValidData(hospital.image_url) ? (
              <img
                src={hospital.image_url}
                alt={hospital.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <FaHospital className="text-8xl text-pink-300 opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            {/* Hospital Type Badge */}
            <div className="absolute bottom-4 left-4">
              <span className="px-4 py-2 bg-white/90 backdrop-blur text-pink-700 rounded-full text-sm font-semibold capitalize shadow-lg">
                {hospital.type === 'district' ? 'District Hospital' :
                 hospital.type === 'subdistrict' ? 'Sub-District Hospital' :
                 hospital.type === 'rural' ? 'Rural Hospital' : 'Special Hospital'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8">
            {/* Hospital Name and Capacity */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{hospital.name}</h2>
              {hasValidData(hospital.capacity) && (
                <div className="flex items-center gap-2 text-pink-600">
                  <FaBed className="text-lg" />
                  <span className="font-medium">{hospital.capacity}</span>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Left Column - Hospital Head & Contact */}
              <div className="md:col-span-1 space-y-6">
                {/* Hospital Head - Only show if head data exists */}
                {(hasValidData(hospital.head_name) || hasValidData(hospital.head_image_url)) && (
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-5 border border-pink-100">
                    <h3 className="text-sm font-bold text-pink-700 uppercase tracking-wide mb-4 flex items-center">
                      <FaUserMd className="mr-2" />
                      Hospital Administration
                    </h3>
                    <div className="text-center">
                      {hasValidData(hospital.head_image_url) && (
                        <img
                          src={hospital.head_image_url}
                          alt={hospital.head_name || 'Hospital Head'}
                          className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-white shadow-lg"
                        />
                      )}
                      {hasValidData(hospital.head_name) && (
                        <p className="font-semibold text-gray-900 text-lg">{hospital.head_name}</p>
                      )}
                      {hasValidData(hospital.head_designation) && (
                        <p className="text-sm text-gray-600 mt-1">{hospital.head_designation}</p>
                      )}
                      {hasValidData(hospital.head_contact) && (
                        <div className="mt-3 pt-3 border-t border-pink-100">
                          <a 
                            href={`tel:${hospital.head_contact}`}
                            className="inline-flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 font-medium"
                          >
                            <FaPhone className="text-xs" />
                            {hospital.head_contact}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Information - Only show section if any contact exists */}
                {(hasValidData(hospital.location) || 
                  hasValidData(hospital.contact) || 
                  hasValidData(hospital.emergency_contact) || 
                  hasValidData(hospital.ambulance_contact) ||
                  hasValidData(hospital.website)) && (
                  <div className="bg-white rounded-xl p-5 border border-pink-100 shadow-sm">
                    <h3 className="text-sm font-bold text-pink-700 uppercase tracking-wide mb-4 flex items-center">
                      <FaPhone className="mr-2" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      {hasValidData(hospital.location) && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                            <FaMapMarkerAlt className="text-pink-500 text-sm" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-0.5">Location</p>
                            <p className="text-sm text-gray-700">{hospital.location}</p>
                          </div>
                        </div>
                      )}
                      
                      {hasValidData(hospital.contact) && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                            <FaPhone className="text-pink-500 text-sm" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-0.5">Main Contact</p>
                            <a 
                              href={`tel:${hospital.contact}`}
                              className="text-sm text-gray-900 font-semibold hover:text-pink-600"
                            >
                              {hospital.contact}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {hasValidData(hospital.emergency_contact) && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 animate-pulse">
                            <FaAmbulance className="text-red-500 text-sm" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-0.5">Emergency</p>
                            <a 
                              href={`tel:${hospital.emergency_contact}`}
                              className="text-sm text-red-600 font-bold hover:text-red-700"
                            >
                              {hospital.emergency_contact}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {hasValidData(hospital.ambulance_contact) && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FaAmbulance className="text-blue-500 text-sm" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-0.5">Ambulance Service</p>
                            <a 
                              href={`tel:${hospital.ambulance_contact}`}
                              className="text-sm text-blue-600 font-semibold hover:text-blue-700"
                            >
                              {hospital.ambulance_contact}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {hasValidData(hospital.website) && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                            <FaGlobe className="text-pink-500 text-sm" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-0.5">Website</p>
                            <a 
                              href={hospital.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-pink-600 hover:text-pink-700 font-medium hover:underline inline-flex items-center gap-1"
                            >
                              Visit Website
                              <FaChevronRight className="text-xs" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Services, About & Facilities */}
              <div className="md:col-span-2 space-y-6">
                {/* About - Only show if data exists */}
                {hasValidData(hospital.about) && (
                  <div className="bg-gradient-to-br from-white to-pink-50/30 rounded-xl p-6 border border-pink-100">
                    <h3 className="text-sm font-bold text-pink-700 uppercase tracking-wide mb-4 flex items-center">
                      <FaHospital className="mr-2" />
                      About Hospital
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{hospital.about}</p>
                  </div>
                )}

                {/* Services - Only show if services array has items */}
                {hospital.services && hospital.services.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-pink-100 shadow-sm">
                    <h3 className="text-sm font-bold text-pink-700 uppercase tracking-wide mb-4 flex items-center">
                      <FaStethoscope className="mr-2" />
                      Services Available
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {hospital.services.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gradient-to-r from-pink-50 to-purple-50 text-pink-700 rounded-lg text-sm font-medium border border-pink-200 hover:shadow-md transition-shadow"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Facilities - Only show if data exists */}
                {hasValidData(hospital.facilities) && (
                  <div className="bg-white rounded-xl p-6 border border-pink-100 shadow-sm">
                    <h3 className="text-sm font-bold text-pink-700 uppercase tracking-wide mb-4 flex items-center">
                      <FaNotesMedical className="mr-2" />
                      Facilities
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {hospital.facilities}
                    </p>
                  </div>
                )}

                {/* Action Buttons - Only show relevant buttons */}
                <div className="flex gap-3 pt-4">
                  {hasValidData(hospital.contact) && (
                    <a
                      href={`tel:${hospital.contact}`}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all text-center shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <FaPhone />
                      Call Hospital
                    </a>
                  )}
                  {hasValidData(hospital.emergency_contact) && (
                    <a
                      href={`tel:${hospital.emergency_contact}`}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all text-center shadow-lg hover:shadow-xl flex items-center justify-center gap-2 animate-pulse"
                    >
                      <FaAmbulance />
                      Emergency
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hospital Card Component - Pink Theme
function HospitalCard({ hospital, onViewMore }) {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-50 hover:border-pink-200">
      {/* Hospital image */}
      <div className="h-48 overflow-hidden relative bg-gradient-to-br from-pink-100 to-pink-50">
        <img 
          src={hospital.image_url || '/api/placeholder/400/300'} 
          alt={hospital.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Hospital info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
          {hospital.name}
        </h3>
        
        <div className="space-y-2 mb-4">
          {hospital.location && (
            <p className="flex items-center text-sm text-gray-600">
              <span className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center mr-2 flex-shrink-0">
                <FaMapMarkerAlt className="text-pink-400 text-xs" />
              </span>
              <span className="truncate">{hospital.location}</span>
            </p>
          )}
          
          {hospital.contact && (
            <p className="flex items-center text-sm text-gray-600">
              <span className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center mr-2 flex-shrink-0">
                <FaPhone className="text-pink-400 text-xs" />
              </span>
              <span className="font-medium">{hospital.contact}</span>
            </p>
          )}

          {hospital.capacity && (
            <p className="flex items-center text-sm text-gray-600">
              <span className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center mr-2 flex-shrink-0">
                <FaBed className="text-pink-400 text-xs" />
              </span>
              <span>{hospital.capacity} Beds Available</span>
            </p>
          )}
        </div>
        
        {/* View Details Button */}
        <button
          onClick={() => onViewMore(hospital)}
          className="w-full py-2.5 text-center text-sm font-semibold text-white bg-pink-500 hover:bg-pink-600 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm hover:shadow-md"
        >
          View Details
          <FaChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// Main Component - Pink and White Theme
export default function SindhudurgHospitalsPage() {
  const [hospitals, setHospitals] = useState({
    district: [],
    subDistrict: [],
    rural: [],
    special: []
  });
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;

      const grouped = {
        district: data?.filter(h => h.type === 'district') || [],
        subDistrict: data?.filter(h => h.type === 'subdistrict') || [],
        rural: data?.filter(h => h.type === 'rural') || [],
        special: data?.filter(h => h.type === 'special') || []
      };

      setHospitals(grouped);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (hospital) => {
    setSelectedHospital(hospital);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHospital(null);
  };

  // Section Component with Icons
  const HospitalSection = ({ title, hospitals, description, icon, iconBg }) => {
    if (hospitals.length === 0) return null;
    
    return (
      <section className="mb-16">
        <div className="flex items-center mb-8">
          <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center mr-4`}>
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {description && (
              <p className="text-gray-600 text-sm mt-1">{description}</p>
            )}
          </div>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hospitals.map((hospital) => (
            <HospitalCard 
              key={hospital.id} 
              hospital={hospital}
              onViewMore={handleViewMore}
            />
          ))}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mx-auto"></div>
            <FaHeartbeat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500 text-xl animate-pulse" />
          </div>
          <p className="text-gray-600 mt-4">Loading healthcare facilities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/50 via-white to-pink-50/30">
      {/* Beautiful Header */}
      <header className="relative bg-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full opacity-10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-20">
          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full mb-6 shadow-lg">
              <FaHospital className="text-white text-3xl" />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Sindhudurg  Healthcare <span className="text-pink-500">Network</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive directory of hospitals and medical facilities in Sindhudurg district
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500">
                  {Object.values(hospitals).flat().length}
                </div>
                <div className="text-sm text-gray-600">Total Hospitals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500">24/7</div>
                <div className="text-sm text-gray-600">Emergency Care</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500">100%</div>
                <div className="text-sm text-gray-600">Coverage</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom wave */}
        <div className="relative">
          <svg className="w-full h-12" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48L60 42C120 36 240 24 360 18C480 12 600 12 720 15C840 18 960 24 1080 27C1200 30 1320 30 1380 30L1440 30V48H0V48Z" 
              fill="url(#gradient-wave)" />
            <defs>
              <linearGradient id="gradient-wave" x1="0" y1="0" x2="1440" y2="0">
                <stop offset="0%" stopColor="#FDF2F8" />
                <stop offset="50%" stopColor="#FCE7F3" />
                <stop offset="100%" stopColor="#FDF2F8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <HospitalSection 
          title="District Hospital" 
          hospitals={hospitals.district}
          description="Primary healthcare facility with comprehensive services"
          icon={<FaHospital className="text-pink-500 text-xl" />}
          iconBg="bg-pink-100"
        />
        
        <HospitalSection 
          title="Sub-District Hospitals" 
          hospitals={hospitals.subDistrict}
          description="Regional hospitals serving talukas"
          icon={<FaClinicMedical className="text-pink-500 text-xl" />}
          iconBg="bg-pink-100"
        />
        
        <HospitalSection 
          title="Rural Hospitals" 
          hospitals={hospitals.rural}
          description="Healthcare centers for rural communities"
          icon={<MdLocalHospital className="text-pink-500 text-xl" />}
          iconBg="bg-pink-100"
        />
        
        <HospitalSection 
          title="Specialized Hospitals" 
          hospitals={hospitals.special}
          description="Specialized medical care facilities"
          icon={<FaNotesMedical className="text-pink-500 text-xl" />}
          iconBg="bg-pink-100"
        />

        {/* Map Section */}
        <section className="mt-16 mb-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100">
            <div className="p-8 bg-gradient-to-r from-pink-500 to-pink-400 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Find Hospitals on Map
                  </h2>
                  <p className="text-pink-100">
                    Locate healthcare facilities across Sindhudurg district
                  </p>
                </div>
                <FaMapMarkerAlt className="text-5xl text-pink-200 hidden md:block" />
              </div>
            </div>
            <div className="h-[500px] bg-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2083.705150418898!2d73.68868733547147!3d16.116302743751643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc0104f6eba8adb%3A0x2195f4cff85c5b24!2sDistrict%20Hospital%2C%20Sindhudurg!5e1!3m2!1sen!2sin!4v1758794607022!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sindhudurg Hospitals Map"
              />
            </div>
          </div>
        </section>

        {/* Emergency Contact Card */}
        <section className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center">
                <FaAmbulance className="mr-3 animate-pulse" />
                Emergency Services
              </h3>
              <p className="text-pink-100">
                For medical emergencies, immediate assistance is available 24/7
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">108</div>
              <div className="text-sm text-pink-100">Ambulance Service</div>
            </div>
          </div>
        </section>
      </main>

      {/* Hospital Detail Modal */}
      <HospitalDetailModal 
        hospital={selectedHospital}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}