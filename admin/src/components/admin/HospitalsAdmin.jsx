// src/components/admin/HospitalsAdmin.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseclient';
import { 
  TbEdit, 
  TbTrash, 
  TbPlus, 
  TbUpload,
  TbLoader2,
  TbHospital
} from 'react-icons/tb';

export default function HospitalsAdmin() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHospital, setEditingHospital] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('type')
        .order('display_order');

      if (error) throw error;
      setHospitals(data || []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHospital = async (hospitalData) => {
    try {
      if (hospitalData.id) {
        const { error } = await supabase
          .from('hospitals')
          .update({
            ...hospitalData,
            updated_at: new Date().toISOString()
          })
          .eq('id', hospitalData.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hospitals')
          .insert([hospitalData]);
        
        if (error) throw error;
      }
      
      setEditingHospital(null);
      fetchHospitals();
    } catch (error) {
      console.error('Error saving hospital:', error);
      alert('Error saving hospital');
    }
  };

  const handleDeleteHospital = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) return;
    
    try {
      const { error } = await supabase
        .from('hospitals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchHospitals();
    } catch (error) {
      console.error('Error deleting hospital:', error);
      alert('Error deleting hospital');
    }
  };

  const handleImageUpload = async (file, type = 'hospital') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      return null;
    }
  };

  const filteredHospitals = filterType === 'all' 
    ? hospitals 
    : hospitals.filter(h => h.type === filterType);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TbLoader2 className="animate-spin h-12 w-12 text-pink-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Hospitals</h1>
        <button
          onClick={() => setEditingHospital({
            name: '',
            type: 'rural',
            location: '',
            capacity: '',
            contact: '',
            website: '',
            services: [],
            display_order: hospitals.length + 1,
            is_active: true
          })}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
        >
          <TbPlus /> Add Hospital
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'district', 'subdistrict', 'rural', 'special'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              filterType === type
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {type === 'all' ? 'All Hospitals' : type}
          </button>
        ))}
      </div>

      {/* Hospitals Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Capacity</th>
              <th className="px-4 py-3 text-left">Head</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHospitals.map((hospital) => (
              <tr key={hospital.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{hospital.name}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs capitalize">
                    {hospital.type}
                  </span>
                </td>
                <td className="px-4 py-3">{hospital.location}</td>
                <td className="px-4 py-3">{hospital.capacity}</td>
                <td className="px-4 py-3">{hospital.head_name || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    hospital.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {hospital.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingHospital(hospital)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <TbEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteHospital(hospital.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TbTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Hospital Form Modal */}
      {editingHospital && (
        <HospitalForm
          hospital={editingHospital}
          onSave={handleSaveHospital}
          onCancel={() => setEditingHospital(null)}
          onImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
}

// Hospital Form Component
function HospitalForm({ hospital, onSave, onCancel, onImageUpload }) {
  const [formData, setFormData] = useState({
    ...hospital,
    services: hospital.services || []
  });
  const [uploading, setUploading] = useState({ hospital: false, head: false });
  const [newService, setNewService] = useState('');

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setUploading({ ...uploading, [type]: true });
      const imageUrl = await onImageUpload(file, type);
      if (imageUrl) {
        if (type === 'hospital') {
          setFormData({ ...formData, image_url: imageUrl });
        } else {
          setFormData({ ...formData, head_image_url: imageUrl });
        }
      }
      setUploading({ ...uploading, [type]: false });
    }
  };

  const addService = () => {
    if (newService.trim()) {
      setFormData({
        ...formData,
        services: [...formData.services, newService.trim()]
      });
      setNewService('');
    }
  };

  const removeService = (index) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          {hospital.id ? 'Edit Hospital' : 'Add Hospital'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">Basic Information</h4>
              
              <div>
                <label className="block text-sm font-medium mb-1">Hospital Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="district">District Hospital</option>
                  <option value="subdistrict">Sub-District Hospital</option>
                  <option value="rural">Rural Hospital</option>
                  <option value="special">Special Hospital</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Capacity</label>
                <input
                  type="text"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., 100 Beds"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Contact</label>
                <input
                  type="text"
                  value={formData.contact || ''}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={formData.emergency_contact || ''}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Ambulance Contact</label>
                <input
                  type="text"
                  value={formData.ambulance_contact || ''}
                  onChange={(e) => setFormData({ ...formData, ambulance_contact: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input
                  type="text"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Hospital Head & Images */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">Hospital Head & Images</h4>
              
              <div>
                <label className="block text-sm font-medium mb-1">Head Name</label>
                <input
                  type="text"
                  value={formData.head_name || ''}
                  onChange={(e) => setFormData({ ...formData, head_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Head Designation</label>
                <input
                  type="text"
                  value={formData.head_designation || ''}
                  onChange={(e) => setFormData({ ...formData, head_designation: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., Medical Superintendent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Head Contact</label>
                <input
                  type="text"
                  value={formData.head_contact || ''}
                  onChange={(e) => setFormData({ ...formData, head_contact: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Hospital Image</label>
                <div className="flex items-center gap-4">
                  {formData.image_url && (
                    <img 
                      src={formData.image_url} 
                      alt="Hospital" 
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'hospital')}
                    className="flex-1"
                    disabled={uploading.hospital}
                  />
                  {uploading.hospital && <TbLoader2 className="animate-spin" />}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Head Image</label>
                <div className="flex items-center gap-4">
                  {formData.head_image_url && (
                    <img 
                      src={formData.head_image_url} 
                      alt="Head" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'head')}
                    className="flex-1"
                    disabled={uploading.head}
                  />
                  {uploading.head && <TbLoader2 className="animate-spin" />}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  min="1"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm font-medium">Active</label>
              </div>
            </div>
          </div>

          {/* Services & Additional Info */}
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-gray-700 border-b pb-2">Services & Additional Info</h4>
            
            <div>
              <label className="block text-sm font-medium mb-1">Services</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="Add a service"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                />
                <button
                  type="button"
                  onClick={addService}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.services.map((service, idx) => (
                  <span
                    key={idx}
                    className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {service}
                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      className="text-pink-600 hover:text-pink-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">About</label>
              <textarea
                value={formData.about || ''}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                rows="3"
                placeholder="Brief description about the hospital"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Facilities</label>
              <textarea
                value={formData.facilities || ''}
                onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                rows="3"
                placeholder="List of facilities available"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Save Hospital
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}