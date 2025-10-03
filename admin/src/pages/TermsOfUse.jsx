// src/pages/TermsOfUse.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="text-pink-600 hover:text-pink-700">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">Terms of Use</span>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
          <h1 className="text-3xl font-bold text-pink-600 mb-6">Terms of Use</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using the Civil Surgeon Office, Sindhudurg website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Use of Website</h2>
              <p className="leading-relaxed mb-3">
                This website is provided by the Department of Health Services, Government of Maharashtra, to provide information about health services and statistics in Sindhudurg district. Users may:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and view public health information</li>
                <li>Download reports and documents made available for public use</li>
                <li>Use the dashboard for viewing health statistics</li>
                <li>Contact the department for health-related queries</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Prohibited Uses</h2>
              <p className="leading-relaxed mb-3">Users are prohibited from:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Attempting to gain unauthorized access to any portion of the website</li>
                <li>Using the website for any unlawful purpose</li>
                <li>Interfering with the proper working of the website</li>
                <li>Transmitting any viruses, worms, or malicious code</li>
                <li>Collecting or harvesting any personally identifiable information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Intellectual Property</h2>
              <p className="leading-relaxed">
                All content on this website, including text, graphics, logos, and images, is the property of the Government of Maharashtra and is protected by applicable copyright and intellectual property laws. Content may be used for personal, non-commercial purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Disclaimer</h2>
              <p className="leading-relaxed">
                The information provided on this website is for general informational purposes only. While we strive to keep the information up-to-date and accurate, we make no representations or warranties of any kind about the completeness, accuracy, or reliability of the information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Privacy</h2>
              <p className="leading-relaxed">
                Your use of our website is also governed by our Website Policies, which describes how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website following any changes indicates your acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Contact Information</h2>
              <p className="leading-relaxed">
                For any queries regarding these Terms of Use, please contact:<br />
                Civil Surgeon Office, Sindhudurg<br />
                Email: health.sindhudurg@gov.in<br />
                Phone: +91 2362 222333
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

export default TermsOfUse;