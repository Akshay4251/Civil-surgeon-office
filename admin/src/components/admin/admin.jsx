import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseclient";
import { useNavigate } from "react-router-dom";
import { 
  FaImages, 
  FaUsers, 
  FaFileUpload, 
  FaImage, 
  FaChartBar, 
  FaHome,
  FaHospital,
  FaNewspaper
} from 'react-icons/fa';
import { HiOutlineEye } from 'react-icons/hi';

// Import sub-components
import HeroSliderManager from './HeroSliderManager';
import TeamManager from './TeamManager';
import PerformanceReportsManager from './PerformanceReportManager';
import GalleryManager from './GalleryManager';
import HealthStatisticsManager from './HealthStatisticsManager';
import HomecontentAdmin from './HomeContentAdmin';
import HospitalsAdmin from './HospitalsAdmin';
import SiteStatisticsAdmin from './SiteStatasticAdmin';
import LatestNewsAdmin from './LatestNewsAdmin'; // New import

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.error('Authentication error:', error);
          navigate('/login');
          return;
        }
        setUser(user);
      } catch (err) {
        console.error('Auth check failed:', err);
        navigate('/login');
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (err) {
      console.error("Error logging out:", err);
      setError("Failed to logout. Please try again.");
    }
  };

  const tabs = [
    { id: 'home', label: 'Home Content', icon: FaHome },
    { id: 'hospitals', label: 'Hospitals', icon: FaHospital },
    { id: 'slides', label: 'Hero Slider', icon: FaImages },
    { id: 'team', label: 'Team', icon: FaUsers },
    { id: 'reports', label: 'Reports', icon: FaFileUpload },
    { id: 'gallery', label: 'Gallery', icon: FaImage },
    { id: 'statistics', label: 'Health Statistics', icon: FaChartBar },
    { id: 'news', label: 'Latest News', icon: FaNewspaper }, // New tab
    { id: 'site-stats', label: 'Site Stats', icon: HiOutlineEye }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-1">Manage Website Content</p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-500">
                  Logged in as: {user.email}
                </span>
              )}
              <button 
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="inline mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
            <button 
              onClick={() => setError("")} 
              className="float-right text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
            <button 
              onClick={() => setSuccess("")} 
              className="float-right text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Content based on active tab */}
        <div>
          {activeTab === 'home' && (
            <HomecontentAdmin 
              setError={setError} 
              setSuccess={setSuccess}
              error={error}
              success={success}
            />
          )}
          {activeTab === 'hospitals' && (
            <HospitalsAdmin 
              setError={setError} 
              setSuccess={setSuccess}
              error={error}
              success={success}
            />
          )}
          {activeTab === 'slides' && (
            <HeroSliderManager 
              setError={setError} 
              setSuccess={setSuccess} 
              error={error}
              success={success}
            />
          )}
          {activeTab === 'team' && (
            <TeamManager 
              setError={setError} 
              setSuccess={setSuccess}
              error={error}
              success={success}
            />
          )}
          {activeTab === 'reports' && (
            <PerformanceReportsManager 
              setError={setError} 
              setSuccess={setSuccess}
              error={error}
              success={success}
            />
          )}
          {activeTab === 'gallery' && (
            <GalleryManager 
              setError={setError} 
              setSuccess={setSuccess}
              error={error}
              success={success}
            />
          )}
          {activeTab === 'statistics' && (
            <HealthStatisticsManager 
              setError={setError} 
              setSuccess={setSuccess}
              error={error}
              success={success}
            />
          )}
          {activeTab === 'news' && (
            <LatestNewsAdmin 
              setError={setError} 
              setSuccess={setSuccess}
              error={error}
              success={success}
            />
          )}
          {activeTab === 'site-stats' && (
            <SiteStatisticsAdmin 
              setError={setError} 
              setSuccess={setSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;