import React from "react";
import { motion } from "framer-motion";

const WhyChooseDigitalScreens = () => {
  // Features data
  const features = [
    {
      icon: "fa-regular fa-life-ring",
      title: "Target Advertising",
      desc: "Our platform allows for precise targeting to reach your desired audience effectively.",
      delay: 0.1
    },
    {
      icon: "fa-solid fa-repeat",
      title: "Dynamic Content",
      desc: "Utilize dynamic content that adapts to user behavior and preferences for a more engaging experience.",
      delay: 0.2
    },
    {
      icon: "fa-solid fa-chart-line",
      title: "Cost Effective",
      desc: "Our solution offers cost-effective advertising options without compromising reach or effectiveness.",
      delay: 0.3
    },
    {
      icon: "fa-regular fa-clock",
      title: "Flexibility & Real-time Updates",
      desc: "Easily update and customize your campaigns in real-time to keep your content fresh and relevant.",
      delay: 0.4
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Why Choose Digital Screens?
        </h2>
        <p className="text-gray-600">
          Digital advertising offers superior engagement, flexibility, and return on investment compared to traditional methods.
          Here's why our digital screen network stands out:
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            variants={itemVariants}
            transition={{ duration: 0.5, delay: feature.delay }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div
              className="text-4xl md:text-5xl mb-4 md:mb-6 flex justify-center"
              style={{ color: "#FDB827" }}
            >
              <i className={feature.icon}></i>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default WhyChooseDigitalScreens;