import React from 'react';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: '50 JOD',
      features: ['1 week display', 'Standard locations', 'Basic analytics']
    },
    {
      name: 'Standard',
      price: '120 JOD',
      features: ['2 weeks display', 'Prime locations', 'Advanced analytics']
    },
    {
      name: 'Premium',
      price: '250 JOD',
      features: ['1 month display', 'Premium locations', 'Full analytics']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Pricing Plans</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8 bg-gray-50">
              <h2 className="text-2xl font-bold text-center">{plan.name}</h2>
              <p className="mt-4 text-3xl font-bold text-center text-[#FDB827]">{plan.price}</p>
            </div>
            <div className="px-6 py-4">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;