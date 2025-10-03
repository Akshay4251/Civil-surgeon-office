// src/components/admin/SiteStatisticsAdmin.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseclient';
import { 
  HiOutlineRefresh,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineSave
} from 'react-icons/hi';
import { BiReset } from 'react-icons/bi';
import { BsCalendarCheck, BsPeopleFill } from 'react-icons/bs';

const SiteStatisticsAdmin = ({ setError, setSuccess }) => {
  const [stats, setStats] = useState({
    visitorCount: 0,
    lastUpdated: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('site_statistics')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'site_statistics' },
        (payload) => {
          if (payload.new) {
            setStats({
              visitorCount: payload.new.visitor_count || 0,
              lastUpdated: payload.new.last_updated
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchStatistics = async () => {
    try {
      const { data, error } = await supabase
        .from('site_statistics')
        .select('visitor_count, last_updated')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setStats({
          visitorCount: data.visitor_count || 0,
          lastUpdated: data.last_updated
        });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to fetch site statistics');
    }
  };

  const updateLastModified = async () => {
    try {
      setLoading(true);
      await supabase.rpc('update_last_modified');
      
      setSuccess('Last updated date has been refreshed!');
      await fetchStatistics();
    } catch (error) {
      console.error('Error updating last modified:', error);
      setError('Failed to update last modified date');
    } finally {
      setLoading(false);
    }
  };

  const resetVisitorCount = async () => {
    if (!window.confirm('Are you sure you want to reset the visitor count to 0?')) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('site_statistics')
        .update({ visitor_count: 0 })
        .eq('id', 1);
      
      if (error) throw error;
      
      setSuccess('Visitor count has been reset!');
      await fetchStatistics();
    } catch (error) {
      console.error('Error resetting visitor count:', error);
      setError('Failed to reset visitor count');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <HiOutlineEye className="text-blue-600" />
          Site Statistics
        </h2>
        <p className="text-gray-600 mt-1">Manage visitor counter and last updated information</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visitor Count Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm uppercase tracking-wide font-medium">
                Total Visitors
              </p>
              <p className="text-4xl font-bold mt-3">
                {stats.visitorCount.toLocaleString('en-IN')}
              </p>
              <p className="text-blue-100 text-xs mt-2">
                Since website launch
              </p>
            </div>
            <BsPeopleFill className="text-6xl text-blue-300 opacity-50" />
          </div>
        </div>

        {/* Last Updated Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm uppercase tracking-wide font-medium">
                Last Updated
              </p>
              <p className="text-lg font-semibold mt-3">
                {formatDate(stats.lastUpdated)}
              </p>
              <p className="text-green-100 text-xs mt-2">
                Content last modified
              </p>
            </div>
            <BsCalendarCheck className="text-6xl text-green-300 opacity-50" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Update Last Modified */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <HiOutlineClock className="text-blue-600" />
            Update Timestamp
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Click the button below to update the "Last Updated" timestamp. 
            This should be done after making any content changes to the website.
          </p>
          <button
            onClick={updateLastModified}
            disabled={loading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
                     flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Updating...
              </>
            ) : (
              <>
                <HiOutlineSave className="text-lg" />
                Update Last Modified Date
              </>
            )}
          </button>
        </div>

        {/* Reset Visitor Count */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <BiReset className="text-red-600" />
            Reset Counter
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Reset the visitor counter to zero. This action cannot be undone. 
            Use this only when absolutely necessary.
          </p>
          <button
            onClick={resetVisitorCount}
            disabled={loading}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
                     flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <HiOutlineRefresh className="text-lg" />
                Reset Visitor Count
              </>
            )}
          </button>
        </div>
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Visitor count increases automatically when new users visit the website</li>
          <li>• Each visitor is counted only once per session</li>
          <li>• Last updated date should be manually updated after making content changes</li>
          <li>• These statistics are displayed in the website footer</li>
        </ul>
      </div>
    </div>
  );
};

export default SiteStatisticsAdmin;