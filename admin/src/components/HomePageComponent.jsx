// src/components/HomePageContent.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';
import { TbLoader2, TbAlertCircle } from 'react-icons/tb';

import Devendra from '../assets/Devendra.jpg';
import Eknath from '../assets/Eknath.jpg';
import Ajit from '../assets/Ajit.png';
import Prakash from '../assets/Prakash.png';
import Meghana from '../assets/Meghana .png';
import Nitesh from '../assets/Nitesh.jpg';
import Trupti from '../assets/Trupti.jpeg';

// Default images mapping
const DEFAULT_IMAGES = {
  'Devendra': Devendra,
  'Eknath': Eknath,
  'Ajit': Ajit,
  'Prakash': Prakash,
  'Meghana': Meghana,
  'Nitesh': Nitesh,
  'Trupti': Trupti,
};

// Placeholder image for fallback
const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="14" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';

/**
 * Helper component for displaying an official's photo and details.
 */
const OfficialCard = ({ name, title, image_url }) => {
  const [imageError, setImageError] = useState(false);
  
  // Format title for potential line breaks
  const formattedTitle = title?.replace(/,/, '<br/>') || '';
  
  // Get default image based on name (partial match)
  const getDefaultImage = () => {
    const firstName = name?.split(' ')[0] || '';
    return DEFAULT_IMAGES[firstName] || placeholderImage;
  };
  
  // Use database image_url if available, otherwise use default image
  const imageSource = image_url || getDefaultImage();

  return (
    <div className="flex flex-col items-center p-2 sm:p-3 md:p-4">
      {/* Image Container (Circular) - Responsive sizes */}
      <div className="relative">
        <div className="
          w-24 h-24 
          sm:w-28 sm:h-28 
          md:w-32 md:h-32 
          lg:w-36 lg:h-36 
          xl:w-40 xl:h-40
          rounded-full overflow-hidden 
          border-2 md:border-3 border-pink-200 
          bg-gray-100 shadow-lg 
          transition-transform duration-300 hover:scale-105
        ">
          <img 
            src={imageError ? placeholderImage : imageSource}
            alt={name} 
            className="w-full h-full object-cover" 
            onError={() => setImageError(true)}
          />
        </div>
      </div>
      
      {/* Info - Responsive text sizes */}
      <div className="mt-3 md:mt-4 text-center max-w-[150px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px]">
        <p className="
          font-bold text-gray-800 leading-tight
          text-xs sm:text-sm md:text-base
          mb-1 md:mb-2
        ">
          {name}
        </p>
        <p 
          className="
            text-gray-600 leading-snug
            text-[10px] sm:text-xs md:text-sm
          " 
          dangerouslySetInnerHTML={{ __html: formattedTitle }} 
        />
      </div>
    </div>
  );
};

/**
 * Section displaying the grid of officials.
 */
const OfficialsSection = ({ officials }) => {
  const topRow = officials.filter(o => o.row_position === 'top').sort((a, b) => a.display_order - b.display_order);
  const middleRow = officials.filter(o => o.row_position === 'middle').sort((a, b) => a.display_order - b.display_order);
  const bottomRow = officials.filter(o => o.row_position === 'bottom').sort((a, b) => a.display_order - b.display_order);

  return (
    <section className="text-center pt-6 sm:pt-8 md:pt-10 pb-6 sm:pb-8 md:pb-10 bg-gradient-to-b from-pink-50 to-white">
      <h2 className="
        text-xl sm:text-2xl md:text-3xl lg:text-4xl
        font-bold mb-6 sm:mb-8 md:mb-10 text-gray-800
      ">
        Our Leadership
      </h2>
      
      {/* Top Row */}
      {topRow.length > 0 && (
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="
            flex flex-wrap justify-center 
            gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10
            px-2 sm:px-4 md:px-6
          ">
            {topRow.map(official => (
              <OfficialCard key={official.id} {...official} />
            ))}
          </div>
        </div>
      )}

      {/* Middle Row */}
      {middleRow.length > 0 && (
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="
            flex flex-wrap justify-center 
            gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10
            px-2 sm:px-4 md:px-6
          ">
            {middleRow.map(official => (
              <OfficialCard key={official.id} {...official} />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Row */}
      {bottomRow.length > 0 && (
        <div>
          <div className="
            flex flex-wrap justify-center 
            gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10
            px-2 sm:px-4 md:px-6
          ">
            {bottomRow.map(official => (
              <OfficialCard key={official.id} {...official} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

/**
 * Section for About Us content.
 */
const AboutUsSection = ({ aboutData }) => (
  <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8">
    <h2 className="
      text-xl sm:text-2xl md:text-3xl 
      font-bold mb-3 sm:mb-4 md:mb-5 text-gray-800
    ">
      {aboutData?.title || 'About Us'}
    </h2>
    <p className="
      text-sm sm:text-base 
      text-gray-700 leading-relaxed text-justify
    ">
      {aboutData?.content || 'Loading content...'}
    </p>
  </div>
);

/**
 * Section for Schemes and Programmes content.
 */
const SchemesSection = ({ schemes }) => {
  const column1 = schemes.filter(s => s.column_number === 1).sort((a, b) => a.display_order - b.display_order);
  const column2 = schemes.filter(s => s.column_number === 2).sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8">
      <h2 className="
        text-xl sm:text-2xl md:text-3xl 
        font-bold mb-3 sm:mb-4 md:mb-5 text-gray-800
      ">
        Schemes/Programmes
      </h2>
      
      {/* Schemes List Container - Stack on mobile, side-by-side on larger screens */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
        {column1.length > 0 && (
          <ul className="list-none p-0 m-0 space-y-2 sm:space-y-3 flex-1">
            {column1.map((item) => (
              <li key={item.id} className="
                relative pl-5 text-gray-700 
                hover:text-pink-600 transition-colors cursor-pointer
                text-sm sm:text-base
              ">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-base sm:text-lg text-pink-500 font-extrabold">
                  •
                </span>
                {item.name}
              </li>
            ))}
          </ul>
        )}
        
        {column2.length > 0 && (
          <ul className="list-none p-0 m-0 space-y-2 sm:space-y-3 flex-1">
            {column2.map((item) => (
              <li key={item.id} className="
                relative pl-5 text-gray-700 
                hover:text-pink-600 transition-colors cursor-pointer
                text-sm sm:text-base
              ">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-base sm:text-lg text-pink-500 font-extrabold">
                  •
                </span>
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/**
 * Main component for the homepage content.
 */
export default function HomePageContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [officials, setOfficials] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    fetchAllData();
    
    // Set up real-time subscription for officials
    const officialsSubscription = supabase
      .channel('officials-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'officials' },
        (payload) => {
          console.log('Officials change received:', payload);
          fetchOfficials();
        }
      )
      .subscribe();

    // Set up real-time subscription for schemes
    const schemesSubscription = supabase
      .channel('schemes-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'schemes' },
        (payload) => {
          console.log('Schemes change received:', payload);
          fetchSchemes();
        }
      )
      .subscribe();

    // Set up real-time subscription for about content
    const aboutSubscription = supabase
      .channel('about-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'about_content' },
        (payload) => {
          console.log('About content change received:', payload);
          fetchAboutContent();
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(officialsSubscription);
      supabase.removeChannel(schemesSubscription);
      supabase.removeChannel(aboutSubscription);
    };
  }, []);

  const fetchOfficials = async () => {
    try {
      const { data, error } = await supabase
        .from('officials')
        .select('*')
        .eq('is_active', true)
        .order('row_position')
        .order('display_order');

      if (error) throw error;
      setOfficials(data || []);
    } catch (err) {
      console.error('Error fetching officials:', err);
    }
  };

  const fetchSchemes = async () => {
    try {
      const { data, error } = await supabase
        .from('schemes')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setSchemes(data || []);
    } catch (err) {
      console.error('Error fetching schemes:', err);
    }
  };

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .eq('is_active', true)
        .single();

      if (!error && data) {
        setAboutData(data);
      }
    } catch (err) {
      console.error('Error fetching about content:', err);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Default initial data with three rows
      const defaultOfficials = [
        { id: 1, name: 'Devendra Fadnavis', title: 'Hon. Deputy Chief Minister', row_position: 'top', display_order: 1, is_active: true },
        { id: 2, name: 'Eknath Shinde', title: 'Hon. Chief Minister', row_position: 'top', display_order: 2, is_active: true },
        { id: 3, name: 'Ajit Pawar', title: 'Hon. Deputy Chief Minister', row_position: 'top', display_order: 3, is_active: true },
        { id: 4, name: 'Prakash Abitkar', title: 'Hon. Minister of Public Health', row_position: 'middle', display_order: 1, is_active: true },
        { id: 5, name: 'Meghana Bordikar', title: 'Hon. Minister of State', row_position: 'middle', display_order: 2, is_active: true },
        { id: 6, name: 'Nitesh Rane', title: 'Hon. Minister of State', row_position: 'bottom', display_order: 1, is_active: true },
        { id: 7, name: 'Trupti Bhagwan Sawant', title: 'Secretary, Public Health Department', row_position: 'bottom', display_order: 2, is_active: true },
      ];

      const defaultSchemes = [
        { id: 1, name: 'Mahatma Jyotiba Phule Jan Arogya Yojana', column_number: 1, display_order: 1, is_active: true },
        { id: 2, name: 'Rastriya Bal Swasthya Karyakram', column_number: 1, display_order: 2, is_active: true },
        { id: 3, name: 'Janani Shishu Suraksha Karyakram', column_number: 1, display_order: 3, is_active: true },
        { id: 4, name: 'Pradhan Mantri Surakshit Matrutva Abhiyan', column_number: 1, display_order: 4, is_active: true },
        { id: 5, name: 'Aam Admi Bima Yojana (AABY)', column_number: 2, display_order: 1, is_active: true },
        { id: 6, name: 'Pradhan Mantri Jan Arogya Yojana', column_number: 2, display_order: 2, is_active: true },
      ];

      const defaultAboutData = {
        title: 'About Us',
        content: 'The Public Health Department of the Government of Maharashtra is a key administrative body responsible for promoting, protecting, and improving the health and well-being of over 13 crore people in the state. The department provides Primary and Secondary Healthcare Services through a comprehensive network of District Hospitals, General Hospitals, Women Hospitals, Sub-district Hospitals, Rural Hospitals, Primary Health Centers, and Sub-centers across all 36 districts.',
        is_active: true
      };

      // Fetch all data in parallel
      const [officialsRes, schemesRes, aboutRes] = await Promise.all([
        supabase
          .from('officials')
          .select('*')
          .eq('is_active', true)
          .order('row_position')
          .order('display_order'),
        
        supabase
          .from('schemes')
          .select('*')
          .eq('is_active', true)
          .order('display_order'),
        
        supabase
          .from('about_content')
          .select('*')
          .eq('is_active', true)
          .single()
      ]);

      // Use database data if available, otherwise use defaults
      setOfficials(officialsRes.data?.length > 0 ? officialsRes.data : defaultOfficials);
      setSchemes(schemesRes.data?.length > 0 ? schemesRes.data : defaultSchemes);
      setAboutData(aboutRes.data || defaultAboutData);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        <div className="flex justify-center items-center">
          <TbLoader2 className="animate-spin h-8 sm:h-10 md:h-12 w-8 sm:w-10 md:w-12 text-pink-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        <div className="text-center">
          <TbAlertCircle className="h-8 sm:h-10 md:h-12 w-8 sm:w-10 md:w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-sm sm:text-base mb-4">{error}</p>
          <button 
            onClick={fetchAllData}
            className="
              bg-pink-600 text-white 
              px-4 sm:px-5 md:px-6 
              py-1.5 sm:py-2 
              text-sm sm:text-base
              rounded hover:bg-pink-700 
              transition-colors duration-200
            "
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Officials Section */}
      <OfficialsSection officials={officials} />
      
      {/* Bottom Content Row - Stack on mobile, side-by-side on desktop */}
      <div className="
        flex flex-col lg:flex-row 
        justify-between gap-6 sm:gap-8 md:gap-10 
        pb-6 sm:pb-8 md:pb-10 
        mt-6 sm:mt-8 md:mt-10
      ">
        <AboutUsSection aboutData={aboutData} />
        <SchemesSection schemes={schemes} />
      </div>
    </div>
  );
}