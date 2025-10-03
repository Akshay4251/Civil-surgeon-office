import React from 'react';
import { 
  FaHospital, 
  FaUserMd, 
  FaAmbulance, 
  FaPills, 
  FaBaby, 
  FaHeartbeat,
  FaMicroscope,
  FaShieldAlt
} from 'react-icons/fa';

const Services = ({ standalone = false }) => {
  const services = [
    {
      icon: <FaHospital />,
      title: 'General Healthcare',
      description: 'Comprehensive healthcare services for all age groups with modern facilities'
    },
    {
      icon: <FaUserMd />,
      title: 'Specialist Consultations',
      description: 'Access to qualified specialists across various medical departments'
    },
    {
      icon: <FaAmbulance />,
      title: 'Emergency Services',
      description: '24/7 emergency medical services with ambulance facilities'
    },
    {
      icon: <FaPills />,
      title: 'Pharmacy Services',
      description: 'Well-stocked pharmacy with essential medicines at affordable rates'
    },
    {
      icon: <FaBaby />,
      title: 'Maternal & Child Health',
      description: 'Specialized care for mothers and children with vaccination programs'
    },
    {
      icon: <FaHeartbeat />,
      title: 'Diagnostic Services',
      description: 'Modern diagnostic facilities including laboratory and imaging services'
    },
    {
      icon: <FaMicroscope />,
      title: 'Laboratory Services',
      description: 'Complete pathology and laboratory testing facilities'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Preventive Healthcare',
      description: 'Health awareness programs and preventive care initiatives'
    }
  ];

  return (
    <section id="services" className={`py-16 ${standalone ? 'pt-24' : ''} bg-white`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Providing comprehensive healthcare services to the people of Sindhudurg district
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-6 bg-gray-50 rounded-lg hover:bg-primary-50 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;