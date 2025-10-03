// src/components/About.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseclient';
import { 
  FaHeartbeat, 
  FaBullseye, 
  FaEye, 
  FaHospital, 
  FaUserMd,
  FaAmbulance,
  FaShieldAlt,
  FaGraduationCap,
  FaUsers,
  FaSpinner
} from 'react-icons/fa';

const About = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch team data from Supabase
  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Supabase error:', error);
        setError("Unable to load team data.");
        return;
      }
      
      setTeamData(data || []);
      
    } catch (err) {
      console.error("Error fetching team data:", err);
      setError("Unable to load team data.");
    } finally {
      setLoading(false);
    }
  };

  // Team member card component - adjusted for 4 in a row
  const TeamMemberCard = ({ member, isLeader = false }) => {
    return (
      <div className="flex flex-col items-center">
        <div
          className={`rounded-lg shadow-xl p-4 ${
            isLeader ? "w-full bg-gradient-to-b from-pink-50 to-white" : "w-full bg-white"
          } transform hover:scale-105 transition-transform duration-300 h-full`}
        >
          <div className="flex flex-col items-center">
            <img
              src={member.image_url || 'https://via.placeholder.com/200x200?text=Photo'}
              alt={member.name}
              className={`${
                isLeader ? "w-28 h-28 md:w-32 md:h-32" : "w-24 h-24 md:w-28 md:h-28"
              } rounded-full object-cover border-4 ${
                isLeader ? "border-pink-300" : "border-pink-200"
              } shadow-lg mb-3`}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/200x200?text=Photo';
              }}
            />
            <h3 className={`${isLeader ? "text-lg md:text-xl" : "text-base md:text-lg"} font-bold mb-2 text-gray-900 text-center`}>
              {member.name}
            </h3>
            <p className={`text-xs md:text-sm font-medium mb-2 ${
              isLeader ? "bg-pink-600 text-white" : "bg-pink-500 text-white"
            } px-2 md:px-3 py-1 rounded-full text-center`}>
              {member.position}
            </p>
            {member.qualification && (
              <p className="text-gray-600 text-xs md:text-sm text-center mt-2 px-2">
                {member.qualification}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const responsibilities = [
    { icon: FaHeartbeat, text: "Implementation of national and state health programs" },
    { icon: FaUserMd, text: "Monitoring and evaluation of healthcare services" },
    { icon: FaShieldAlt, text: "Disease surveillance and epidemic control" },
    { icon: FaAmbulance, text: "Coordination of emergency medical services" },
    { icon: FaHospital, text: "Healthcare infrastructure development" },
    { icon: FaGraduationCap, text: "Training and capacity building of healthcare staff" },
    { icon: FaUsers, text: "Public health awareness and education" }
  ];

  useEffect(() => {
    document.title = 'About - Civil Surgeon Office Sindhudurg';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = 'Learn about Civil Surgeon Office Sindhudurg\'s mission, vision, and commitment to healthcare excellence.';
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Learn about Civil Surgeon Office Sindhudurg\'s mission, vision, and commitment to healthcare excellence.';
      document.head.appendChild(meta);
    }

    fetchTeamData();

    return () => {
      document.title = 'Civil Surgeon Office Sindhudurg';
    };
  }, []);

  // Separate leader and team members
  const leader = teamData?.find(m => m.is_leader);
  const members = teamData?.filter(m => !m.is_leader) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-pink-600 mb-4 mx-auto" />
          <p className="text-gray-600">Loading team information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">About Us</h1>
            <p className="text-xl text-pink-100">
              Committed to Excellence in Healthcare Services
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Error Message */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Leadership Section - Updated for 4 members in a row */}
          {teamData && teamData.length > 0 && (
            <div className="mb-12">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Our Leadership Team
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Dedicated healthcare professionals committed to serving the community
                </p>
              </div>

              {/* Organization Chart - Updated Layout */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                  Organizational Structure
                </h2>
                
                {/* Leader at Top */}
                {leader && (
                  <div className="flex justify-center mb-8">
                    <div className="w-full max-w-xs">
                      <TeamMemberCard member={leader} isLeader={true} />
                    </div>
                  </div>
                )}
                
                {/* Connecting Line */}
                {leader && members.length > 0 && (
                  <div className="flex justify-center mb-4">
                    <div className="w-0.5 h-12 bg-pink-400"></div>
                  </div>
                )}
                
                {/* Horizontal Line for Multiple Members */}
                {members.length > 1 && (
                  <div className="flex justify-center mb-4">
                    <div className="relative w-full max-w-5xl">
                      <div className="h-0.5 bg-pink-400 absolute top-0 left-10 right-10"></div>
                      {/* Vertical connectors for each member */}
                      <div className="flex justify-between relative">
                        {members.map((_, index) => (
                          <div 
                            key={index} 
                            className="w-0.5 h-8 bg-pink-400"
                            style={{
                              position: 'absolute',
                              left: `${(100 / members.length) * index + (100 / members.length) / 2}%`,
                              transform: 'translateX(-50%)'
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Team Members in a Single Row */}
                <div className="mt-12">
                  <div className={`grid grid-cols-2 ${members.length <= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3 lg:grid-cols-4'} gap-4 md:gap-6 max-w-6xl mx-auto`}>
                    {members.map((member) => (
                      <TeamMemberCard key={member.id} member={member} isLeader={false} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Mission Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 border-t-4 border-pink-500">
              <div className="flex items-center mb-4">
                <div className="bg-pink-100 p-3 rounded-full">
                  <FaBullseye className="text-pink-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 ml-4">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To provide accessible, affordable, and quality healthcare services to all citizens 
                of Sindhudurg district, ensuring comprehensive health coverage and promoting 
                preventive healthcare practices.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 border-t-4 border-pink-500">
              <div className="flex items-center mb-4">
                <div className="bg-pink-100 p-3 rounded-full">
                  <FaEye className="text-pink-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 ml-4">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To establish Sindhudurg as a model district in healthcare delivery, achieving 
                optimal health outcomes through innovative medical practices, community 
                participation, and sustainable health systems.
              </p>
            </div>
          </div>

          {/* About Office Section */}
          <div className="bg-white rounded-xl shadow-lg p-10 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full -mr-32 -mt-32 opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-4 rounded-full">
                  <FaHospital className="text-white text-3xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-4">About the Office</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed text-lg">
                  The Civil Surgeon Office Sindhudurg serves as the apex healthcare administrative 
                  body for the district, overseeing and coordinating all government healthcare 
                  facilities and programs.
                </p>
                <p className="leading-relaxed text-lg">
                  Our office manages a network of hospitals, primary health centers, and 
                  sub-centers across the district, ensuring that quality healthcare reaches 
                  every corner of Sindhudurg.
                </p>
              </div>
            </div>
          </div>

          {/* Key Responsibilities Section */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-300 rounded-xl shadow-lg p-10 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Key Responsibilities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {responsibilities.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="bg-white/20 p-3 rounded-full flex-shrink-0">
                    <item.icon className="text-xl" />
                  </div>
                  <p className="text-pink-50 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default About;