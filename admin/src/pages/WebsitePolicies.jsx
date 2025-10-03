// src/pages/WebsitePolicies.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const WebsitePolicies = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="text-pink-600 hover:text-pink-700">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">Website Policies</span>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
          <h1 className="text-3xl font-bold text-pink-600 mb-6">Website Policies</h1>
          
          <div className="space-y-8 text-gray-700">
            {/* Privacy Policy Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-pink-200">
                Privacy Policy
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Information Collection</h3>
                  <p className="leading-relaxed">
                    We collect only basic visitor statistics (visitor count) through session-based tracking. 
                    No personal information is collected without your explicit consent. When you contact us 
                    through forms, we collect only the information you provide voluntarily.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Use of Information</h3>
                  <p className="leading-relaxed">
                    Information collected is used solely for improving our services and responding to your 
                    queries. We do not sell, trade, or otherwise transfer your information to third parties.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Security</h3>
                  <p className="leading-relaxed">
                    We implement appropriate security measures to protect against unauthorized access, 
                    alteration, disclosure, or destruction of information.
                  </p>
                </div>
              </div>
            </section>

            {/* Copyright Policy Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-pink-200">
                Copyright Policy
              </h2>
              
              <div className="space-y-4">
                <p className="leading-relaxed">
                  Material featured on this website may be reproduced free of charge for non-commercial 
                  purposes after obtaining permission from the Civil Surgeon Office, Sindhudurg. 
                  We request that the source is acknowledged and a copy of your publication is sent to us.
                </p>
                <p className="leading-relaxed">
                  The permission to reproduce this material does not extend to any material on this site 
                  which is identified as being the copyright of a third party. Authorization to reproduce 
                  such material must be obtained from the copyright holders concerned.
                </p>
              </div>
            </section>

            {/* Hyperlinking Policy Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-pink-200">
                Hyperlinking Policy
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Links to Our Website</h3>
                  <p className="leading-relaxed">
                    We welcome links to our website. However, we request that you inform us about any 
                    links provided to this website so that we can keep track of usage patterns.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Links to External Websites</h3>
                  <p className="leading-relaxed">
                    This website may contain links to other websites. We are not responsible for the 
                    content or privacy practices of these external sites. We encourage users to read 
                    the privacy statements of other websites before providing personal information.
                  </p>
                </div>
              </div>
            </section>

            {/* Accessibility Statement Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-pink-200">
                Accessibility Statement
              </h2>
              
              <p className="leading-relaxed">
                We are committed to ensuring that our website is accessible to all users, including 
                those with disabilities. We strive to follow Web Content Accessibility Guidelines (WCAG) 
                2.1 Level AA standards. If you encounter any accessibility issues, please contact us.
              </p>
            </section>

            {/* Content Moderation Policy Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-pink-200">
                Content Moderation Policy
              </h2>
              
              <p className="leading-relaxed">
                All content published on this website is reviewed and approved by authorized personnel 
                from the Civil Surgeon Office, Sindhudurg. We ensure that all information is accurate, 
                up-to-date, and relevant to public health services in the district.
              </p>
            </section>

            {/* Disclaimer Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-pink-200">
                Disclaimer
              </h2>
              
              <p className="leading-relaxed">
                The information posted on this website is for general awareness only and should not be 
                used as a substitute for professional medical advice. Though all efforts have been made 
                to ensure the accuracy and currency of the content, the Civil Surgeon Office, Sindhudurg 
                assumes no responsibility for errors or omissions.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Last Updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePolicies;