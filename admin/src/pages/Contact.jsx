import React, { useEffect } from 'react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock,
  FaDirections,
  FaHospital,
  FaExclamationTriangle,
  FaAmbulance,
  FaUserMd
} from 'react-icons/fa';

const Contact = () => {
  // Modern meta tag handling
  useEffect(() => {
    document.title = 'Contact - Civil Surgeon Office Sindhudurg';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = 'Contact Civil Surgeon Office Sindhudurg for healthcare services, inquiries, and emergency assistance.';
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Contact Civil Surgeon Office Sindhudurg for healthcare services, inquiries, and emergency assistance.';
      document.head.appendChild(meta);
    }

    return () => {
      document.title = 'Civil Surgeon Office Sindhudurg';
    };
  }, []);

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: 'Main Office Address',
      details: [
        'Civil Surgeon Office',
        'District Hospital Sindhudurg, Oros',
        'Sindhudurg, Maharashtra - 416812'
      ],
      action: {
        text: 'Get Directions',
        icon: <FaDirections />,
        link: 'https://maps.google.com/?q=Civil+Surgeon+Office+Sindhudurg'
      },
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      icon: <FaPhone />,
      title: 'Contact Numbers',
      details: [
        'Office: 02362-228901',
        'Emergency: 102',
        'Ambulance: 108'
      ],
      action: {
        text: 'Call Now',
        icon: <FaPhone />,
        link: 'tel:+912362228035'
      },
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email Address',
      details: [
        'cssindhudurg@gmail.com',
        'cssindhudurg@yahoo.co.in'
      ],
      action: {
        text: 'Send Email',
        icon: <FaEnvelope />,
        link: 'mailto:cssindhudurg@gmail.com'
      },
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      icon: <FaClock />,
      title: 'Office Hours',
      details: [
        'Monday - Friday: 10:00 AM - 6:00 PM',
        'Saturday Sunday & Holidays: Closed',
        'Emergency Services: 24/7'
      ],
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    }
  ];

  const subOffices = [
    { 
      name: 'Rural Hospital Kudal', 
      phone: '02362-221781',
      address: 'Kudal, Sindhudurg',
      type: 'Rural Hospital'
    },
    { 
      name: 'Sub District Hospital Sawantwadi', 
      phone: '02363-275035',
      address: 'Sawantwadi, Sindhudurg',
      type: 'Sub District Hospital'
    },
    { 
      name: 'Rural Hospital Malvan', 
      phone: '02365-252032',
      address: 'Malvan, Sindhudurg',
      type: 'Rural Hospital'
    },
    { 
      name: 'Rural Hospital Vengurla', 
      phone: '02366-262235',
      address: 'Vengurla, Sindhudurg',
      type: 'Rural Hospital'
    },
    { 
      name: 'Sub District Hospital Kankavli', 
      phone: '02367-233959',
      address: 'Kankavli, Sindhudurg',
      type: 'Sub District Hospital'
    },
    { 
      name: 'Rural Hospital Devgad', 
      phone: '02364-262253',
      address: 'Devgad, Sindhudurg',
      type: 'Rural Hospital'
    }
  ];

  const emergencyNumbers = [
    { service: 'Medical Emergency', number: '102', icon: <FaAmbulance /> },
    { service: 'Ambulance Service', number: '108', icon: <FaAmbulance /> },
    { service: 'Health Helpline', number: '104', icon: <FaUserMd /> },
    { service: 'Child Helpline', number: '1098', icon: <FaPhone /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">Contact Us</h1>
            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
              We're here to help. Reach out to us for any healthcare inquiries or assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 animate-pulse">
            <FaExclamationTriangle className="text-3xl" />
            <div className="text-center">
              <p className="font-bold text-lg">For Medical Emergencies</p>
              <p className="text-lg">Call <span className="text-3xl font-bold mx-2 text-yellow-300">102</span> or visit the nearest hospital immediately</p>
            </div>
            <FaExclamationTriangle className="text-3xl" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Contact Information */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className={`${info.bgColor} border-2 ${info.borderColor} rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                  <div className={`w-14 h-14 rounded-full ${info.bgColor} flex items-center justify-center mb-4 border-2 ${info.borderColor}`}>
                    <span className={`${info.iconColor} text-2xl`}>{info.icon}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-3">{info.title}</h3>
                  <div className="space-y-1 mb-4">
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-gray-700 text-sm font-medium">{detail}</p>
                    ))}
                  </div>
                  {info.action && (
                    <a
                      href={info.action.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center space-x-2 ${info.iconColor} hover:underline font-semibold text-sm`}
                    >
                      <span>{info.action.icon}</span>
                      <span>{info.action.text}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Numbers Section */}
          <div className="mb-12">
            <div className="bg-red-50 rounded-2xl shadow-lg p-8 border-2 border-red-200">
              <h2 className="text-2xl font-bold text-red-800 mb-6 text-center">Emergency Contact Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {emergencyNumbers.map((emergency, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 text-center border-2 border-red-200 hover:border-red-400 transition-colors">
                    <div className="text-red-600 text-3xl mb-2 flex justify-center">{emergency.icon}</div>
                    <p className="text-gray-700 font-medium text-sm mb-1">{emergency.service}</p>
                    <p className="text-red-600 text-2xl font-bold">{emergency.number}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sub-Offices and Hospitals */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaHospital className="mr-3 text-pink-600" />
                District Hospitals & Health Centers
              </h2>
              <div className="space-y-4">
                {subOffices.map((office, index) => (
                  <div key={index} className="bg-gradient-to-r from-pink-50 to-white rounded-lg p-4 border-l-4 border-pink-500 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-base">{office.name}</p>
                        <p className="text-gray-600 text-sm mt-1">{office.address}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
                          {office.type}
                        </span>
                      </div>
                      <div className="text-right">
                        <a 
                          href={`tel:${office.phone}`} 
                          className="text-pink-600 hover:text-pink-700 font-semibold text-sm inline-flex items-center"
                        >
                          <FaPhone className="mr-1" />
                          {office.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaMapMarkerAlt className="mr-3 text-pink-600" />
                Location Map
              </h2>
              <div className="rounded-xl overflow-hidden shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.3684!2d73.6846!3d15.8514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDUxJzA1LjAiTiA3M8KwNDEnMDQuNiJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-xl"
                ></iframe>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <p className="text-gray-700 text-sm">
                  <strong>Note:</strong> The Civil Surgeon Office is located within the District Hospital Complex in Oros, Sindhudurg.
                </p>
                <a
                  href="https://maps.google.com/?q=Civil+Surgeon+Office+Sindhudurg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  <FaDirections className="mr-2" />
                  Get Directions on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Contact;