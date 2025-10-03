import React from 'react';

// Import all images at the top
import Devendra from '../assets/Devendra.jpg';
import Eknath from '../assets/Eknath.jpg';
import Ajit from '../assets/Ajit.png';
import Prakash from '../assets/Prakash.png';
import Meghana from '../assets/Meghana .png';
// Import placeholder
// import placeholder from '../assets/placeholder.jpg';
import Nitesh from '../assets/Nitesh.jpg';
import Trupti from '../assets/Trupti.jpeg';



// Rest of your component remains the same...

// Updated official data with correct image paths
const officialData = [
  { 
    id: 1, 
    name: "Shri. Devendra Fadnavis", 
    title: "Hon'ble Chief Minister", 
    imagePath: Devendra 
  },
  { 
    id: 2, 
    name: "Shri. Eknath Shinde", 
    title: "Hon'ble Deputy Chief Minister", 
    imagePath: Eknath 
  },
  { 
    id: 3, 
    name: "Shri. Ajit Pawar", 
    title: "Hon'ble Deputy Chief Minister", 
    imagePath: Ajit
  },
  { 
    id: 4, 
    name: "Shri. Prakash Abitkar", 
    title: "Hon'ble Minister, Public Health and Family Welfare", 
    imagePath: Prakash 
  },
  { 
    id: 5, 
    name: "Smt. Meghana Sakore-Bordikar", 
    title: "Hon'ble State Minister, Public Health and Family Welfare", 
    imagePath: Meghana 
  },
  { 
    id: 6, 
    name: "Shri. Nitesh Narayan Rane", 
    title: "Hon. Minister of Fisheries, Ports Maharashtra State and Guardian Minister Sindhudurg", 
    imagePath: Nitesh 
  },
  { 
    id: 7, 
    name: "Smt. Trupti Dhodmise", 
    title: "Collector & District Magistrate", 
    imagePath: Trupti 
  },
];

const schemesData = [
  ["State Nursing Cell", "Accredited Social Health Activist (ASHA)", "Rugna Kalyan Samiti", "Telemedicine"],
  ["Training And Capacity Building", "National Sickle Cell Elimination Mission", "National Health Mission"],
];

/**
 * Helper component for displaying an official's photo and details.
 */
const OfficialCard = ({ name, title, imagePath }) => {
  // Placeholder image path
  const placeholderImage = "/images/placeholder.jpg";
  
  // Format title for potential line breaks
  const formattedTitle = title.replace(/,/, '<br/>');

  return (
    <div className="w-full max-w-[200px] text-center p-2 flex flex-col items-center">
      {/* Image Container (Circular) */}
      <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-2 border-pink-200 mb-3 bg-gray-100 shadow-lg">
        <img 
          src={imagePath} 
          alt={name} 
          className="w-full h-full object-cover" 
          onError={(e) => { 
            e.target.src = placeholderImage; 
            e.target.onerror = null; // Prevent infinite loop
          }}
        />
      </div>
      
      {/* Info */}
      <div className="official-info mt-2">
        <p className="font-bold text-base mb-1 leading-tight text-gray-800">{name}</p>
        <p 
          className="text-sm text-gray-600 leading-snug" 
          dangerouslySetInnerHTML={{ __html: formattedTitle }} 
        />
      </div>
    </div>
  );
};

/**
 * Section displaying the grid of officials.
 */
const OfficialsSection = () => {
  const topRow = officialData.slice(0, 5);
  const bottomRow = officialData.slice(5);

  return (
    <section className="text-center pt-10 pb-10 bg-gradient-to-b from-pink-50 to-white">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Leadership</h2>
      
      {/* Top Row: 5 Officials */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8 justify-items-center mb-10">
        {topRow.map(official => (
          <OfficialCard key={official.id} {...official} />
        ))}
      </div>

      {/* Bottom Row: 2 Officials (Centered Flex) */}
      <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
        {bottomRow.map(official => (
          <OfficialCard key={official.id} {...official} />
        ))}
      </div>
    </section>
  );
};

/**
 * Section for About Us content.
 */
const AboutUsSection = () => (
  <div className="w-full lg:w-1/2 p-4">
    <h2 className="text-3xl font-bold mb-4 text-gray-800">About Us</h2>
    <p className="text-gray-700 leading-relaxed mb-6 text-justify">
      The Public Health Department of the Government of Maharashtra is a key administrative body 
      responsible for promoting, protecting, and improving the health and well-being of over 13 crore 
      people in the state. The department provides Primary and Secondary Healthcare Services 
      through a comprehensive network of District Hospitals, General Hospitals, Women Hospitals, 
      Sub-district Hospitals, Rural Hospitals, Primary Health Centers, and Sub-centers across all 36 districts.
    </p>
    <button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-2 px-5 rounded font-medium transition duration-150 shadow-md hover:shadow-lg">
      Read More
    </button>
  </div>
);

/**
 * Section for Schemes and Programmes content.
 */
const SchemesSection = () => (
  <div className="w-full lg:w-1/2 p-4">
    <h2 className="text-3xl font-bold mb-4 text-gray-800">Schemes/Programmes</h2>
    
    {/* Schemes List Container */}
    <div className="flex flex-col sm:flex-row gap-8">
      {schemesData.map((list, index) => (
        <ul key={index} className="list-none p-0 m-0 space-y-2">
          {list.map((item, i) => (
            <li key={i} className="relative pl-5 text-gray-700 hover:text-pink-600 transition-colors cursor-pointer">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg text-pink-500 font-extrabold">
                •
              </span>
              {item}
            </li>
          ))}
        </ul>
      ))}
    </div>
    
    <button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-2 px-5 rounded font-medium mt-8 transition duration-150 shadow-md hover:shadow-lg">
      View All
    </button>
  </div>
);

/**
 * Main component for the requested content section.
 */
export default function HomePageContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Officials Section */}
      <OfficialsSection />
      
      {/* Bottom Content Row */}
      <div className="flex flex-col lg:flex-row justify-between gap-10 pb-10 mt-10">
        <AboutUsSection />
        <SchemesSection />
      </div>
    </div>
  );
}