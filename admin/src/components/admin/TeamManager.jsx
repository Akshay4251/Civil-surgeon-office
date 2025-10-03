// src/components/admin/TeamManager.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseclient";
import { FaEdit, FaSave, FaTimes, FaSpinner, FaUser, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import AlertMessage from '../common/AlertMessage';

const TeamManager = ({ setError, setSuccess, error, success }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    position: '',
    qualification: '',
    image_url: '',
    is_leader: false
  });
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError("");
      
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      setTeamMembers(data || []);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to load team members. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const startEditingMember = (member) => {
    setEditingMember(member.id);
    setEditForm({
      name: member.name || '',
      position: member.position || '',
      qualification: member.qualification || '',
      image_url: member.image_url || '',
      is_leader: member.is_leader || false
    });
  };

  const cancelEditingMember = () => {
    setEditingMember(null);
    setEditForm({ 
      name: '', 
      position: '', 
      qualification: '', 
      image_url: '', 
      is_leader: false 
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");

      const fileExt = file.name.split('.').pop();
      const fileName = `team-member-${Date.now()}.${fileExt}`;
      const filePath = `team-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setEditForm(prev => ({
        ...prev,
        image_url: data.publicUrl
      }));

    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error uploading image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const saveTeamMemberChanges = async () => {
    if (!editingMember) return;

    // Validation
    if (!editForm.name || !editForm.position) {
      setError("Name and Position are required fields");
      return;
    }

    try {
      setError("");
      setSuccess("");

      // If setting as leader, unset other leaders
      if (editForm.is_leader) {
        await supabase
          .from('team_members')
          .update({ is_leader: false })
          .neq('id', editingMember);
      }

      const { error } = await supabase
        .from('team_members')
        .update({
          name: editForm.name,
          position: editForm.position,
          qualification: editForm.qualification,
          image_url: editForm.image_url,
          is_leader: editForm.is_leader,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingMember);

      if (error) throw error;

      await fetchTeamMembers();
      cancelEditingMember();
      setSuccess("Team member updated successfully!");
      setTimeout(() => setSuccess(""), 3000);

    } catch (error) {
      console.error('Error saving team member:', error);
      setError('Error saving changes. Please try again.');
    }
  };

  const handleOrderChange = async (member, direction) => {
    try {
      const currentIndex = teamMembers.findIndex(m => m.id === member.id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex < 0 || newIndex >= teamMembers.length) return;
      
      const targetMember = teamMembers[newIndex];
      
      // Swap display_order values
      await Promise.all([
        supabase
          .from('team_members')
          .update({ display_order: targetMember.display_order })
          .eq('id', member.id),
        supabase
          .from('team_members')
          .update({ display_order: member.display_order })
          .eq('id', targetMember.id)
      ]);
      
      await fetchTeamMembers();
      setSuccess("Order updated successfully!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (error) {
      console.error('Error changing order:', error);
      setError('Error updating order');
    }
  };

  const addNewMember = async () => {
    try {
      setError("");
      const maxOrder = Math.max(...teamMembers.map(m => m.display_order || 0), 0);
      const nextMemberId = Math.max(...teamMembers.map(m => m.member_id || 0), 0) + 1;
      
      const { error } = await supabase
        .from('team_members')
        .insert([{
          member_id: nextMemberId,
          name: 'New Team Member',
          position: 'Position',
          qualification: 'Qualification',
          image_url: 'https://via.placeholder.com/400x400?text=Photo',
          is_leader: false,
          display_order: maxOrder + 1
        }]);

      if (error) throw error;
      
      await fetchTeamMembers();
      setSuccess("New team member added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error('Error adding member:', error);
      setError('Error adding new member');
    }
  };

  const deleteMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      
      await fetchTeamMembers();
      setSuccess("Team member deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error('Error deleting member:', error);
      setError('Error deleting member');
    }
  };

  // Separate leader and team members
  const leader = teamMembers.find(m => m.is_leader);
  const members = teamMembers.filter(m => !m.is_leader);

  return (
    <>
      <AlertMessage error={error} success={success} setError={setError} setSuccess={setSuccess} />
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Team Members Management</h2>
          <button
            onClick={addNewMember}
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors flex items-center gap-2"
          >
            <FaUser size={14} />
            Add New Member
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <FaSpinner className="animate-spin h-8 w-8 text-pink-600" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Leader Section */}
            {leader && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">Team Leader</h3>
                <MemberCard
                  member={leader}
                  isEditing={editingMember === leader.id}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  onEdit={() => startEditingMember(leader)}
                  onSave={saveTeamMemberChanges}
                  onCancel={cancelEditingMember}
                  onDelete={() => deleteMember(leader.id)}
                  onImageUpload={handleImageUpload}
                  uploadingImage={uploadingImage}
                  showOrderControls={false}
                  isLeader={true}
                />
              </div>
            )}

            {/* Team Members Section */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">Team Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {members.map((member, index) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    isEditing={editingMember === member.id}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    onEdit={() => startEditingMember(member)}
                    onSave={saveTeamMemberChanges}
                    onCancel={cancelEditingMember}
                    onDelete={() => deleteMember(member.id)}
                    onImageUpload={handleImageUpload}
                    uploadingImage={uploadingImage}
                    showOrderControls={true}
                    onOrderChange={(direction) => handleOrderChange(member, direction)}
                    isFirst={index === 0}
                    isLast={index === members.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Member Card Component
const MemberCard = ({ 
  member, 
  isEditing, 
  editForm, 
  setEditForm, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete,
  onImageUpload, 
  uploadingImage,
  showOrderControls,
  onOrderChange,
  isFirst,
  isLast,
  isLeader
}) => {
  return (
    <div className={`border ${isLeader ? 'border-pink-300 bg-pink-50' : 'border-gray-200'} rounded-lg p-4`}>
      <div className="flex items-start gap-4">
        <img
          src={member.image_url || 'https://via.placeholder.com/100x100?text=Photo'}
          alt={member.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/100x100?text=Photo';
          }}
        />
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter name"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Position *</label>
                <input
                  type="text"
                  value={editForm.position}
                  onChange={(e) => setEditForm(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter position"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Qualification</label>
                <input
                  type="text"
                  value={editForm.qualification}
                  onChange={(e) => setEditForm(prev => ({ ...prev, qualification: e.target.value }))}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter qualification"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editForm.image_url}
                  onChange={(e) => setEditForm(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Image URL"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Or upload image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  disabled={uploadingImage}
                  className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`leader-${member.id}`}
                  checked={editForm.is_leader}
                  onChange={(e) => setEditForm(prev => ({ ...prev, is_leader: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor={`leader-${member.id}`} className="text-sm text-gray-700">
                  Set as Team Leader
                </label>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  disabled={uploadingImage}
                  className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {uploadingImage ? <FaSpinner className="animate-spin" size={10} /> : <FaSave size={10} />}
                  Save
                </button>
                <button
                  onClick={onCancel}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <FaTimes size={10} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <h3 className="font-medium text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.position}</p>
                {member.qualification && (
                  <p className="text-xs text-gray-500 mt-1">{member.qualification}</p>
                )}
                {isLeader && (
                  <span className="inline-block mt-2 px-2 py-1 bg-pink-200 text-pink-800 text-xs rounded-full">
                    Team Leader
                  </span>
                )}
              </div>
              
              <div className="flex gap-2 items-center">
                <button
                  onClick={onEdit}
                  className="bg-pink-600 text-white px-3 py-1 rounded text-xs hover:bg-pink-700 transition-colors flex items-center gap-1"
                >
                  <FaEdit size={10} />
                  Edit
                </button>
                
                {showOrderControls && (
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => onOrderChange('up')}
                      disabled={isFirst}
                      className={`p-1 ${isFirst ? 'text-gray-300' : 'text-gray-600 hover:text-pink-600'}`}
                      title="Move up"
                    >
                      <FaArrowUp size={12} />
                    </button>
                    <button
                      onClick={() => onOrderChange('down')}
                      disabled={isLast}
                      className={`p-1 ${isLast ? 'text-gray-300' : 'text-gray-600 hover:text-pink-600'}`}
                      title="Move down"
                    >
                      <FaArrowDown size={12} />
                    </button>
                  </div>
                )}
                
                <button
                  onClick={onDelete}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamManager;