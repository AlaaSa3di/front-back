import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axiosConfig';

const SpaceTypesCategories = () => {
  const [spaceTypes, setSpaceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaceTypes = async () => {
      try {
        setLoading(true);
        const response = await api.get('/screens/space-types');
        setSpaceTypes(response.data.data);
      } catch (error) {
        console.error('Error fetching space types:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpaceTypes();
  }, []);

  const handleTypeClick = (spaceType) => {
    navigate(`/screens?spaceType=${spaceType}`);
  };

  // Translate space type from backend key to display name
  const getSpaceTypeName = (type) => {
    const translations = {
      building_facade: 'Building Facades',
      mall_interior: 'Mall Interiors',
      billboard: 'Billboards',
      public_transport: 'Public Transport',
      other: 'Other Spaces'
    };
    return translations[type] || type;
  };

  // Icon mapping for different space types
  const getSpaceTypeIcon = (type) => {
    switch (type) {
      case 'building_facade':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        );
      case 'mall_interior':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3zm18 4H3m4 0v14m10-14v14" />
        );
      case 'billboard':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        );
      case 'public_transport':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 5h8m-4 5h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
        );
      default:
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        );
    }
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 rounded-full border-4 border-[#FDB827] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-center">Screen Categories by Space Type</h2>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {spaceTypes.map((type) => (
          <motion.div
            key={type.spaceType}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            onClick={() => handleTypeClick(type.spaceType)}
            className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg"
          >
            <div className="h-16 w-16 mx-auto mb-4 bg-[#FDB827]/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FDB827]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {getSpaceTypeIcon(type.spaceType)}
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">{getSpaceTypeName(type.spaceType)}</h3>
            <p className="text-sm text-gray-500">{type.count} {type.count === 1 ? 'Screen' : 'Screens'}</p>
            
            <button 
              className={`mt-4 w-full py-3 rounded-md font-medium text-black transition-colors bg-[#FDB827] hover:bg-[#F26B0F]/90`}
            >
              View Screens
            </button>
          </motion.div>
        ))}
      </motion.div>
      
      {spaceTypes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No space types available.</p>
        </div>
      )}
    </div>
  );
};

export default SpaceTypesCategories;