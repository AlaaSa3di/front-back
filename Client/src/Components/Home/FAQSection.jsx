import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What types of screens do you offer?',
    answer: 'We offer high-resolution LED screens in various sizes suitable for both indoor and outdoor environments.'
  },
  {
    question: 'Where are your screens located?',
    answer: 'We have over 50 screens distributed across different areas in Jordan.'
  },
  {
    question: 'How can I advertise on your screens?',
    answer: 'You can contact us through the "Contact Us" page or fill out the booking form. Our team will get in touch with you shortly.'
  },
  {
    question: 'What is the duration of the ad display?',
    answer: 'The ad duration depends on the package you choose. It can range from a week to several months.'
  },
  {
    question: 'Do you provide performance reports?',
    answer: 'Yes, we provide regular reports showing impressions and screen locations where your ad was displayed.'
  }
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center text-left px-6 py-4 focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-800">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
