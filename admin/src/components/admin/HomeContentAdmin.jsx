// src/components/admin/HomeContentAdmin.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseclient';
import { 
  TbEdit, 
  TbTrash, 
  TbPlus, 
  TbUpload, 
  TbCheck,
  TbX,
  TbLoader2,
  TbArrowUp,
  TbArrowDown
} from 'react-icons/tb';

export default function HomeContentAdmin() {
  const [officials, setOfficials] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('officials');
  
  // Form states
  const [editingOfficial, setEditingOfficial] = useState(null);
  const [editingScheme, setEditingScheme] = useState(null);
  const [editingAbout, setEditingAbout] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [officialsRes, schemesRes, aboutRes] = await Promise.all([
        supabase.from('officials').select('*').order('row_position').order('display_order'),
        supabase.from('schemes').select('*').order('display_order'),
        supabase.from('about_content').select('*').single()
      ]);

      setOfficials(officialsRes.data || []);
      setSchemes(schemesRes.data || []);
      setAboutContent(aboutRes.data || {
        title: 'About Us',
        content: ''
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Officials CRUD
  const handleSaveOfficial = async (officialData) => {
    try {
      if (officialData.id) {
        // Update
        const { error } = await supabase
          .from('officials')
          .update({
            ...officialData,
            updated_at: new Date().toISOString()
          })
          .eq('id', officialData.id);
        
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('officials')
          .insert([officialData]);
        
        if (error) throw error;
      }
      
      setEditingOfficial(null);
      fetchData();
    } catch (error) {
      console.error('Error saving official:', error);
      alert('Error saving official');
    }
  };

  const handleDeleteOfficial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this official?')) return;
    
    try {
      const { error } = await supabase
        .from('officials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting official:', error);
      alert('Error deleting official');
    }
  };

  // Quick position change functions
  const handleMoveOfficial = async (official, newPosition) => {
    try {
      const { error } = await supabase
        .from('officials')
        .update({
          row_position: newPosition,
          updated_at: new Date().toISOString()
        })
        .eq('id', official.id);
      
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error moving official:', error);
      alert('Error moving official');
    }
  };

  const handleChangeOrder = async (official, direction) => {
    const officialsInRow = officials.filter(o => o.row_position === official.row_position);
    const currentIndex = officialsInRow.findIndex(o => o.id === official.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= officialsInRow.length) return;
    
    const targetOfficial = officialsInRow[newIndex];
    
    try {
      await Promise.all([
        supabase
          .from('officials')
          .update({ display_order: targetOfficial.display_order })
          .eq('id', official.id),
        supabase
          .from('officials')
          .update({ display_order: official.display_order })
          .eq('id', targetOfficial.id)
      ]);
      
      fetchData();
    } catch (error) {
      console.error('Error changing order:', error);
      alert('Error changing order');
    }
  };

  // Schemes CRUD
  const handleSaveScheme = async (schemeData) => {
    try {
      if (schemeData.id) {
        // Update
        const { error } = await supabase
          .from('schemes')
          .update({
            ...schemeData,
            updated_at: new Date().toISOString()
          })
          .eq('id', schemeData.id);
        
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('schemes')
          .insert([schemeData]);
        
        if (error) throw error;
      }
      
      setEditingScheme(null);
      fetchData();
    } catch (error) {
      console.error('Error saving scheme:', error);
      alert('Error saving scheme');
    }
  };

  const handleDeleteScheme = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scheme?')) return;
    
    try {
      const { error } = await supabase
        .from('schemes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting scheme:', error);
      alert('Error deleting scheme');
    }
  };

  // About Content Update
  const handleSaveAbout = async (aboutData) => {
    try {
      if (aboutContent?.id) {
        // Update
        const { error } = await supabase
          .from('about_content')
          .update({
            ...aboutData,
            updated_at: new Date().toISOString()
          })
          .eq('id', aboutContent.id);
        
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('about_content')
          .insert([aboutData]);
        
        if (error) throw error;
      }
      
      setEditingAbout(false);
      fetchData();
    } catch (error) {
      console.error('Error saving about content:', error);
      alert('Error saving about content');
    }
  };

  // Upload image to Supabase Storage
  const handleImageUpload = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `officials/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TbLoader2 className="animate-spin h-12 w-12 text-pink-600" />
      </div>
    );
  }

  // Group officials by row
  const groupedOfficials = {
    top: officials.filter(o => o.row_position === 'top').sort((a, b) => a.display_order - b.display_order),
    middle: officials.filter(o => o.row_position === 'middle').sort((a, b) => a.display_order - b.display_order),
    bottom: officials.filter(o => o.row_position === 'bottom').sort((a, b) => a.display_order - b.display_order)
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Homepage Content</h1>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 border-b">
        <button
          onClick={() => setActiveTab('officials')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'officials'
              ? 'text-pink-600 border-b-2 border-pink-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Officials
        </button>
        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'schemes'
              ? 'text-pink-600 border-b-2 border-pink-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Schemes
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'about'
              ? 'text-pink-600 border-b-2 border-pink-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          About Content
        </button>
      </div>

      {/* Officials Tab */}
      {activeTab === 'officials' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Officials</h2>
            <button
              onClick={() => setEditingOfficial({
                name: '',
                title: '',
                image_url: '',
                display_order: 1,
                row_position: 'top',
                is_active: true
              })}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
            >
              <TbPlus /> Add Official
            </button>
          </div>

          {/* Officials by Row */}
          {['top', 'middle', 'bottom'].map((row) => (
            <div key={row} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 capitalize bg-gray-100 p-2 rounded">
                {row} Row ({groupedOfficials[row].length} officials)
              </h3>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {groupedOfficials[row].length === 0 ? (
                  <p className="p-4 text-gray-500 text-center">No officials in this row</p>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">Order</th>
                        <th className="px-4 py-3 text-left">Image</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Quick Actions</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedOfficials[row].map((official, index) => (
                        <tr key={official.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleChangeOrder(official, 'up')}
                                disabled={index === 0}
                                className={`p-1 ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-pink-600'}`}
                              >
                                <TbArrowUp size={16} />
                              </button>
                              <span className="px-2">{official.display_order}</span>
                              <button
                                onClick={() => handleChangeOrder(official, 'down')}
                                disabled={index === groupedOfficials[row].length - 1}
                                className={`p-1 ${index === groupedOfficials[row].length - 1 ? 'text-gray-300' : 'text-gray-600 hover:text-pink-600'}`}
                              >
                                <TbArrowDown size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {official.image_url && (
                              <img 
                                src={official.image_url} 
                                alt={official.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium">{official.name}</td>
                          <td className="px-4 py-3 text-sm">{official.title}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              official.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {official.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {row !== 'top' && (
                                <button
                                  onClick={() => handleMoveOfficial(official, row === 'bottom' ? 'middle' : 'top')}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                  title={`Move to ${row === 'bottom' ? 'middle' : 'top'} row`}
                                >
                                  Move ↑
                                </button>
                              )}
                              {row !== 'bottom' && (
                                <button
                                  onClick={() => handleMoveOfficial(official, row === 'top' ? 'middle' : 'bottom')}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                  title={`Move to ${row === 'top' ? 'middle' : 'bottom'} row`}
                                >
                                  Move ↓
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingOfficial(official)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <TbEdit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteOfficial(official.id)}
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
                )}
              </div>
            </div>
          ))}

          {/* Edit Official Form */}
          {editingOfficial && (
            <OfficialForm
              official={editingOfficial}
              onSave={handleSaveOfficial}
              onCancel={() => setEditingOfficial(null)}
              onImageUpload={handleImageUpload}
            />
          )}
        </div>
      )}

      {/* Schemes Tab */}
      {activeTab === 'schemes' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Schemes/Programmes</h2>
            <button
              onClick={() => setEditingScheme({
                name: '',
                column_number: 1,
                display_order: schemes.length + 1,
                is_active: true
              })}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
            >
              <TbPlus /> Add Scheme
            </button>
          </div>

          {/* Schemes List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Column</th>
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map((scheme) => (
                  <tr key={scheme.id} className="border-t">
                    <td className="px-4 py-3">{scheme.name}</td>
                    <td className="px-4 py-3">Column {scheme.column_number}</td>
                    <td className="px-4 py-3">{scheme.display_order}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        scheme.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {scheme.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingScheme(scheme)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <TbEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteScheme(scheme.id)}
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

          {/* Edit Scheme Form */}
          {editingScheme && (
            <SchemeForm
              scheme={editingScheme}
              onSave={handleSaveScheme}
              onCancel={() => setEditingScheme(null)}
            />
          )}
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">About Content</h2>
            {!editingAbout && (
              <button
                onClick={() => setEditingAbout(true)}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
              >
                <TbEdit /> Edit Content
              </button>
            )}
          </div>

          {editingAbout ? (
            <AboutForm
              content={aboutContent}
              onSave={handleSaveAbout}
              onCancel={() => setEditingAbout(false)}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-2">{aboutContent?.title}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{aboutContent?.content}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Official Form Component
function OfficialForm({ official, onSave, onCancel, onImageUpload }) {
  const [formData, setFormData] = useState(official);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const imageUrl = await onImageUpload(file);
      if (imageUrl) {
        setFormData({ ...formData, image_url: imageUrl });
      }
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          {official.id ? 'Edit Official' : 'Add Official'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <textarea
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                rows="2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <div className="flex items-center gap-4">
                {formData.image_url && (
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                  disabled={uploading}
                />
                {uploading && <TbLoader2 className="animate-spin" />}
              </div>
              <input
                type="text"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                placeholder="Or enter image URL directly"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Row Position</label>
                <select
                  value={formData.row_position}
                  onChange={(e) => setFormData({ ...formData, row_position: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="top">Top Row</option>
                  <option value="middle">Middle Row</option>
                  <option value="bottom">Bottom Row</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  min="1"
                  required
                />
              </div>
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
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Scheme Form Component
function SchemeForm({ scheme, onSave, onCancel }) {
  const [formData, setFormData] = useState(scheme);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          {scheme.id ? 'Edit Scheme' : 'Add Scheme'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Column</label>
                <select
                  value={formData.column_number}
                  onChange={(e) => setFormData({ ...formData, column_number: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value={1}>Column 1</option>
                  <option value={2}>Column 2</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  min="1"
                  required
                />
              </div>
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
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// About Form Component
function AboutForm({ content, onSave, onCancel }) {
  const [formData, setFormData] = useState(content || {
    title: 'About Us',
    content: '',
    is_active: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              rows="8"
              required
              placeholder="Enter the about content here..."
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
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}