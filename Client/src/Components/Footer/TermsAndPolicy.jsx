import React from 'react';

const TermsAndPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#FDB827]">Terms and Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Terms of Service</h2>
            <p className="mb-4 text-gray-600">
              By accessing our digital screens advertising platform, you agree to be bound by these terms of service.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>You must be at least 18 years old to use our services</li>
              <li>All advertisement content must comply with Jordanian laws and regulations</li>
              <li>We reserve the right to reject any advertising content without explanation</li>
              <li>Payments are non-refundable once the ad campaign has started</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Privacy Policy</h2>
            <p className="mb-4 text-gray-600">
              We are committed to protecting your personal information and respecting your privacy.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>We collect only necessary information to provide our services</li>
              <li>Your payment information is processed securely and not stored on our servers</li>
              <li>We may use cookies to improve your experience on our website</li>
              <li>We will never sell or share your personal data with third parties without your consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about these terms or our privacy practices, please contact us at:
            </p>
            <p className="mt-2 text-gray-800 font-medium">
              Email: <a href="mailto:spot.flash2025@gmail.com" className="text-[#FDB827]">spot.flash2025@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPolicy;