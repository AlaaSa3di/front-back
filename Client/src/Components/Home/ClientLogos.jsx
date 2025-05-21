import React, { useState } from 'react';
import { motion } from 'framer-motion';

const clients = [
  { name: 'Arab Bank', logo: '/images/clients/arab bank.jpg' },
  { name: 'BYD', logo: '/images/clients/byd.png' },
  { name: 'Chevrolet', logo: '/images/clients/chevrolet.png' },
  { name: 'Ford', logo: '/images/clients/ford.png' },
  { name: 'Samsung', logo: '/images/clients/samsung.png' },
  { name: 'Jordan Kuwait Bank', logo: '/images/clients/jk bank.png' },
  { name: 'Hyundai', logo: '/images/clients/Hyundai.png' },
  { name: 'KIA', logo: '/images/clients/kia.png' },
  { name: 'Toyota', logo: '/images/clients/toyota.png' },
  { name: 'Honda', logo: '/images/clients/honda.png' }
];

const ClientLogos = () => {
  const [isHovered, setIsHovered] = useState(false);

  const animation = {
    x: ['0%', '-100%'],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 20,
        ease: 'linear',
      },
    },
  };

  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Trusted by Leading Brands
        </h2>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex w-max gap-12">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                className="flex gap-12 items-center w-max"
                animate={!isHovered ? animation : { x: 0 }}
              >
                {clients.map((client, index) => (
                  <div key={index} className="flex justify-center items-center px-6">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="h-16 object-contain grayscale hover:grayscale-0 transition duration-300"
                    />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
