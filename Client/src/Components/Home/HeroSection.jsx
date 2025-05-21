import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

const HeroSection = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await api.get("/hero");
        setHeroData(response.data.data);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#FDB827] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
          onError={(e) => console.error("Video error:", e.target.error)}
        >
          <source src={heroData.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0  bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
<h1
  className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fadeIn"
  style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)' }}
>
  {heroData.title}
</h1>
<p
  className="text-xl md:text-2xl text-white max-w-2xl mb-8 animate-fadeIn delay-100"
  style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)' }}
>
  {heroData.subtitle}
</p>

        <button
          onClick={() => navigate("/screens")}
          className="bg-[#FDB827] hover:bg-[#F26B0F] text-black font-bold py-3 px-8 rounded-md text-lg transition-all duration-300 animate-fadeIn delay-200"
        >
          {heroData.buttonText}
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
