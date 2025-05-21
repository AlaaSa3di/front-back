import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '50+', label: 'Screens Nationwide' },
  { value: '5K+', label: 'Daily Views' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '35%', label: 'Average ROI Increase' }
];

const ImpactStats = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Impact in Numbers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 rounded-lg shadow text-center"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <h3 className="text-5xl font-bold text-[#FDB827] mb-2">{stat.value}</h3>
              <p className="text-gray-700">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
