// src/pages/Help.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const helpSections = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'navigation', title: 'Navigation Guide' },
    { id: 'dashboard', title: 'Using Dashboard' },
    { id: 'reports', title: 'Accessing Reports' },
    { id: 'contact', title: 'Contact Support' },
    { id: 'faq', title: 'Frequently Asked Questions' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="text-pink-600 hover:text-pink-700">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">Help</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-pink-600 mb-4">Help Topics</h2>
              <nav className="space-y-2">
                {helpSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-pink-100 text-pink-700 font-semibold'
                        : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
              <h1 className="text-3xl font-bold text-pink-600 mb-6">Help Center</h1>

              {/* Getting Started */}
              {activeSection === 'getting-started' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Getting Started</h2>
                  <div className="space-y-4 text-gray-700">
                    <p className="leading-relaxed">
                      Welcome to the Civil Surgeon Office, Sindhudurg website. This portal provides 
                      comprehensive health statistics and information about health services in Sindhudurg district.
                    </p>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Key Features:</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>View real-time health statistics dashboard</li>
                        <li>Access performance reports and documents</li>
                        <li>Browse photo gallery of health initiatives</li>
                        <li>Find information about hospitals and health centers</li>
                        <li>Contact department officials</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Guide */}
              {activeSection === 'navigation' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Navigation Guide</h2>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Main Menu</h3>
                      <p className="mb-3">The main navigation menu provides access to:</p>
                      <ul className="space-y-2 ml-4">
                        <li><strong>Home:</strong> Overview and latest updates</li>
                        <li><strong>Dashboard:</strong> Interactive health statistics</li>
                        <li><strong>Reports:</strong> Downloadable performance reports</li>
                        <li><strong>Gallery:</strong> Photos of events and initiatives</li>
                        <li><strong>About:</strong> Department information</li>
                        <li><strong>Contact:</strong> Get in touch with us</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Dashboard Guide */}
              {activeSection === 'dashboard' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Using the Dashboard</h2>
                  <div className="space-y-4 text-gray-700">
                    <p className="leading-relaxed">
                      The dashboard provides comprehensive health statistics for Sindhudurg district.
                    </p>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">How to Use:</h3>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>Navigate to Dashboard from the main menu</li>
                        <li>Use the year selector to filter data by specific years</li>
                        <li>Click on chart legends to show/hide specific data series</li>
                        <li>Hover over data points to see detailed information</li>
                        <li>Use the Export button to download data</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Reports Access */}
              {activeSection === 'reports' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Accessing Reports</h2>
                  <div className="space-y-4 text-gray-700">
                    <p className="leading-relaxed">
                      Performance reports and documents are available for download.
                    </p>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">To Download Reports:</h3>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>Go to the Reports section</li>
                        <li>Browse available reports by category</li>
                        <li>Click on the report title to view details</li>
                        <li>Click the download button to save the PDF</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Support */}
              {activeSection === 'contact' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Contact Support</h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3">Office Contact</h3>
                      <p><strong>Address:</strong> Civil Surgeon Office, Sindhudurg, Maharashtra - 416601</p>
                      <p><strong>Phone:</strong> +91 2362 222333</p>
                      <p><strong>Email:</strong> health.sindhudurg@gov.in</p>
                      <p><strong>Working Hours:</strong> Monday to Friday: 10:00 AM - 5:30 PM</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">For Technical Support:</h3>
                      <p>Email us at: support.health.sindhudurg@gov.in</p>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ */}
              {activeSection === 'faq' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        Q: How often is the data updated?
                      </h3>
                      <p className="text-gray-700">
                        A: Health statistics are updated regularly. The dashboard shows the last updated 
                        date at the bottom of each page.
                      </p>
                    </div>
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        Q: Can I download the statistical data?
                      </h3>
                      <p className="text-gray-700">
                        A: Yes, you can export data from the dashboard using the Export button. 
                        Data is available in CSV format.
                      </p>
                    </div>
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        Q: How do I report an issue with the website?
                      </h3>
                      <p className="text-gray-700">
                        A: Please email us at support.health.sindhudurg@gov.in with details of the issue.
                      </p>
                    </div>
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        Q: Is the website mobile-friendly?
                      </h3>
                      <p className="text-gray-700">
                        A: Yes, the website is fully responsive and works on all devices including 
                        smartphones and tablets.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;