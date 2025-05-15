// import React from "react";
// import { Link } from "react-router-dom";

// const About = () => {
//   return (
//     <div className="bg-[#F1F1F1] min-h-screen">
//       {/* Header/Hero Section */}
//       <div className="relative h-96">
//         {/* Background image with overlay */}
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200')",
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         >
//           <div className="absolute inset-0 bg-black opacity-60"></div>
//         </div>

//         {/* Header Content */}
//         <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
//           {/* Logo */}
//           <div className="flex items-center mb-6">
//             <div className="bg-[#FDB827] rounded-full h-14 w-14 flex items-center justify-center shadow-lg">
//               <span className="text-white font-bold text-3xl"></span>
//             </div>
//             <span className="ml-3 text-white font-bold text-3xl">ORBITRA</span>
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
//             Our Cosmic Journey
//           </h1>
//           <p className="text-xl text-white max-w-2xl">
//             Pioneering the future of space exploration since 2018
//           </p>
//         </div>
//       </div>

//       {/* Mission Statement Section */}
//       <div className="py-16 px-4 max-w-6xl mx-auto">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission</h2>
//           <p className="text-xl max-w-3xl mx-auto text-gray-600">
//             At ExploreMe, we believe that space exploration is humanity's
//             greatest adventure. We're dedicated to making the cosmos accessible,
//             understandable, and exciting for everyone.
//           </p>
//         </div>

//         {/* Values Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//             <div className="h-3 bg-[#21209C]"></div>
//             <div className="p-6">
//               <div className="bg-[#FDB827] rounded-full h-12 w-12 flex items-center justify-center mb-4">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M13 10V3L4 14h7v7l9-11h-7z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold mb-2 text-gray-800">
//                 Innovation
//               </h3>
//               <p className="text-gray-600">
//                 We push boundaries by developing cutting-edge technologies that
//                 transform our understanding of the universe.
//               </p>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//             <div className="h-3 bg-[#21209C]"></div>
//             <div className="p-6">
//               <div className="bg-[#FDB827] rounded-full h-12 w-12 flex items-center justify-center mb-4">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold mb-2 text-gray-800">
//                 Discovery
//               </h3>
//               <p className="text-gray-600">
//                 We are explorers at heart, committed to uncovering the mysteries
//                 of space and sharing them with the world.
//               </p>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//             <div className="h-3 bg-[#21209C]"></div>
//             <div className="p-6">
//               <div className="bg-[#FDB827] rounded-full h-12 w-12 flex items-center justify-center mb-4">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold mb-2 text-gray-800">
//                 Collaboration
//               </h3>
//               <p className="text-gray-600">
//                 We believe that space belongs to everyone, and we work with
//                 partners worldwide to advance our cosmic understanding.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Our Story Section */}
//       <div className="bg-black py-16 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-3xl font-bold mb-6 text-white">Our Story</h2>
//               <p className="text-white mb-4">
//                 Founded in 2018 by a team of astronauts, astrophysicists, and
//                 space enthusiasts, ExploreMe was born from a simple idea: space
//                 exploration should inspire everyone.
//               </p>
//               <p className="text-white mb-4">
//                 What started as a small educational platform has grown into a
//                 comprehensive space exploration company. Today, we combine
//                 research, education, and adventure to create meaningful
//                 connections between Earth and the cosmos.
//               </p>
//               <p className="text-white">
//                 As we continue to grow, our mission remains unchanged: to make
//                 space accessible to all and inspire the next generation of
//                 cosmic explorers.
//               </p>
//             </div>
//             <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
//               <img
//                 src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=600"
//                 alt="Team of space enthusiasts"
//                 className="absolute inset-0 w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Achievements Section */}
//       <div className="py-16 px-4 max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
//           Our Achievements
//         </h2>

//         <div className="space-y-12">
//           {/* Achievement 1 */}
//           <div className="flex flex-col md:flex-row items-center">
//             <div className="bg-[#FDB827] rounded-full h-16 w-16 flex items-center justify-center flex-shrink-0 mb-4 md:mb-0 md:mr-6">
//               <span className="text-white font-bold text-xl">01</span>
//             </div>
//             <div>
//               <h3 className="text-xl font-bold mb-2 text-gray-800">
//                 First Private Lunar Analysis
//               </h3>
//               <p className="text-gray-600">
//                 In 2020, our research team conducted the first privately funded
//                 comprehensive analysis of lunar soil samples, revealing new
//                 insights about the Moon's formation.
//               </p>
//             </div>
//           </div>

//           {/* Achievement 2 */}
//           <div className="flex flex-col md:flex-row items-center">
//             <div className="bg-[#FDB827] rounded-full h-16 w-16 flex items-center justify-center flex-shrink-0 mb-4 md:mb-0 md:mr-6">
//               <span className="text-white font-bold text-xl">02</span>
//             </div>
//             <div>
//               <h3 className="text-xl font-bold mb-2 text-gray-800">
//                 Virtual Space Academy
//               </h3>
//               <p className="text-gray-600">
//                 Our educational platform has reached over 1 million students
//                 worldwide, offering interactive courses on astronomy,
//                 astrophysics, and space technology.
//               </p>
//             </div>
//           </div>

//           {/* Achievement 3 */}
//           <div className="flex flex-col md:flex-row items-center">
//             <div className="bg-[#FDB827] rounded-full h-16 w-16 flex items-center justify-center flex-shrink-0 mb-4 md:mb-0 md:mr-6">
//               <span className="text-white font-bold text-xl">03</span>
//             </div>
//             <div>
//               <h3 className="text-xl font-bold mb-2 text-gray-800">
//                 Exoplanet Detection System
//               </h3>
//               <p className="text-gray-600">
//                 In 2023, we developed a revolutionary algorithm that improves
//                 exoplanet detection accuracy by 42%, now used by observatories
//                 worldwide.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Team Section */}
//       <div className="bg-gray-100 py-16 px-4">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
//             Our Team
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {/* Team Member 1 */}
//             <div className="bg-white rounded-lg overflow-hidden shadow-md">
//               <div className="p-4">
//                 <h3 className="font-bold text-lg text-gray-800">Ramzi Zamil</h3>
//                 <p className="text-sm text-[#21209C] font-medium">
//                   CEO & Founder
//                 </p>
//                 <p className="mt-2 text-gray-600 text-sm">
//                   Former NASA astronaut with three space missions and a Ph.D. in
//                   Astrophysics.
//                 </p>
//               </div>
//             </div>

//             {/* Team Member 2 */}
//             <div className="bg-white rounded-lg overflow-hidden shadow-md">
//               <div className="p-4">
//                 <h3 className="font-bold text-lg text-gray-800">
//                   Ala'a Al-Saadi
//                 </h3>
//                 <p className="text-sm text-[#21209C] font-medium">
//                   Chief Scientist
//                 </p>
//                 <p className="mt-2 text-gray-600 text-sm">
//                   Leading astrophysicist specializing in exoplanet research and
//                   planetary formation.
//                 </p>
//               </div>
//             </div>

//             {/* Team Member 3 */}
//             <div className="bg-white rounded-lg overflow-hidden shadow-md">
//               <div className="p-4">
//                 <h3 className="font-bold text-lg text-gray-800">
//                   Lawrence Al-Khalailah
//                 </h3>
//                 <p className="text-sm text-[#21209C] font-medium">
//                   Engineering Director
//                 </p>
//                 <p className="mt-2 text-gray-600 text-sm">
//                   Aerospace engineer with 15+ years of experience developing
//                   space technologies.
//                 </p>
//               </div>
//             </div>

//             {/* Team Member 4 */}
//             <div className="bg-white rounded-lg overflow-hidden shadow-md">
//               <div className="p-4">
//                 <h3 className="font-bold text-lg text-gray-800">
//                   Belal Kahaleh
//                 </h3>
//                 <p className="text-sm text-[#21209C] font-medium">
//                   Education Lead
//                 </p>
//                 <p className="mt-2 text-gray-600 text-sm">
//                   Educational innovator passionate about bringing space science
//                   to classrooms worldwide.
//                 </p>
//               </div>
//             </div>
//             <div className="bg-white rounded-lg overflow-hidden shadow-md">
//               <div className="p-4">
//                 <h3 className="font-bold text-lg text-gray-800">Noor Sroor</h3>
//                 <p className="text-sm text-[#21209C] font-medium">
//                   Education Lead
//                 </p>
//                 <p className="mt-2 text-gray-600 text-sm">
//                   Educational innovator passionate about bringing space science
//                   to classrooms worldwide.
//                 </p>
//               </div>
//             </div>
//             <div className="bg-white rounded-lg overflow-hidden shadow-md">
//               <div className="p-4">
//                 <h3 className="font-bold text-lg text-gray-800">
//                   Rana Salameh
//                 </h3>
//                 <p className="text-sm text-[#21209C] font-medium">
//                   Education Lead
//                 </p>
//                 <p className="mt-2 text-gray-600 text-sm">
//                   Educational innovator passionate about bringing space science
//                   to classrooms worldwide.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="py-16 px-4 text-center">
//         <div className="max-w-3xl mx-auto">
//           <h2 className="text-3xl font-bold mb-4 text-gray-800">
//             Join Our Cosmic Journey
//           </h2>
//           <p className="text-gray-600 mb-8">
//             Ready to explore the universe with us? Become part of our community
//             of space enthusiasts.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <Link
//               to="/contact"
//               className="bg-[#21209C] hover:bg-[#191583] text-white font-medium py-3 px-8 rounded-md transition duration-300"
//             >
//               Contact Us
//             </Link>
//           </div>
//           <p className="text-sm text-gray-500 mt-6">
//             Join over 10,000 space enthusiasts who have already embarked on this
//             journey
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;


import { useState } from "react";

const About = () => {
  const [activeTab, setActiveTab] = useState("mission");

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/api/placeholder/400/400",
      bio: "Sarah founded SpotFlash with a vision to transform the advertising landscape through innovative digital solutions. With over 15 years of experience in marketing and technology."
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image: "/api/placeholder/400/400",
      bio: "Michael oversees all technical aspects of SpotFlash, from platform development to hardware integration. His background in IoT and digital signage has been instrumental to our success."
    },
    {
      name: "Amira Al-Hassan",
      role: "Creative Director",
      image: "/api/placeholder/400/400",
      bio: "Amira brings creative excellence to every campaign. Her award-winning designs and strategic approach help our clients achieve maximum impact with their digital advertising."
    },
    {
      name: "David Okafor",
      role: "Head of Business Development",
      image: "/api/placeholder/400/400",
      bio: "David builds strong partnerships that expand our reach. His deep understanding of the advertising market helps businesses of all sizes unlock their digital potential."
    }
  ];
  
  const stats = [
    { number: "500+", label: "Digital Displays Installed" },
    { number: "85%", label: "Average Increase in Ad Visibility" },
    { number: "24/7", label: "Customer Support" },
    { number: "43+", label: "Cities Covered" }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Company Founded",
      description: "SpotFlash was established with a mission to revolutionize outdoor advertising in Jordan."
    },
    {
      year: "2022",
      title: "First Major Contract",
      description: "Secured a partnership with Amman's largest shopping district to install 50+ digital displays."
    },
    {
      year: "2023",
      title: "Expanded to 3 New Cities",
      description: "Successfully deployed our digital advertising network in Irbid, Aqaba, and Madaba."
    },
    {
      year: "2024",
      title: "Technology Innovation Award",
      description: "Recognized for our contribution to sustainable advertising solutions in the MENA region."
    },
    {
      year: "2025",
      title: "International Expansion",
      description: "Beginning operations in neighboring countries with our proven digital advertising model."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-70"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{
              backgroundImage: "url('/api/placeholder/1920/600')",
              backgroundPosition: "center"
            }}
          ></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">About SpotFlash</h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-300">
            Transforming traditional advertising spaces into dynamic digital experiences that capture attention and deliver results.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Story</h2>
            <div className="mt-6 text-gray-600 space-y-6">
              <p className="text-lg">
                SpotFlash was born from a simple observation: traditional paper billboards and posters were becoming increasingly ineffective in our digital world. Our founder saw an opportunity to bridge the gap between physical advertising spaces and digital technology.
              </p>
              <p className="text-lg">
                Starting in 2021 in Zarqa, Jordan, we began replacing static paper advertisements with dynamic digital displays that could be updated instantly, show multiple ads in rotation, and deliver powerful analytics to advertisers.
              </p>
              <p className="text-lg">
                Today, we're proud to be leading the digital transformation of outdoor advertising across Jordan and beyond, helping businesses of all sizes increase their visibility while reducing paper waste and environmental impact.
              </p>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <div className="pl-4 -ml-4 h-full lg:relative">
              <img
                className="rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-full lg:max-w-none"
                src="/api/placeholder/800/600"
                alt="Our office"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-extrabold text-[#FDB827]">{stat.number}</p>
                <p className="mt-2 text-lg font-medium text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values Tabs */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Who We Are</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our guiding principles shape everything we do at SpotFlash, from how we develop our technology to how we interact with our clients and communities.
          </p>
        </div>

        <div className="mt-12">
          <div className="border-b border-gray-200">
            <div className="max-w-2xl mx-auto">
              <nav className="-mb-px flex space-x-8">
                {["mission", "vision", "values"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${
                      activeTab === tab
                        ? "border-[#FDB827] text-[#FDB827]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg capitalize`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="mt-10 max-w-3xl mx-auto">
            {activeTab === "mission" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                <p className="text-lg text-gray-600">
                  To revolutionize the outdoor advertising industry by providing innovative digital solutions that maximize visibility for businesses while promoting sustainability.
                </p>
                <p className="text-lg text-gray-600">
                  We're committed to helping businesses of all sizes access high-impact advertising spaces that were previously only available to those with large marketing budgets.
                </p>
                <div className="mt-6">
                  <img
                    className="rounded-lg shadow-xl"
                    src="/api/placeholder/800/400"
                    alt="SpotFlash digital display in action"
                  />
                </div>
              </div>
            )}

            {activeTab === "vision" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                <p className="text-lg text-gray-600">
                  We envision a world where digital advertising spaces enhance urban environments, provide value to local businesses, and connect communities with relevant information and offers.
                </p>
                <p className="text-lg text-gray-600">
                  By 2030, we aim to replace 75% of traditional paper advertising spaces in our markets with smart, sustainable digital alternatives that reduce waste and increase effectiveness.
                </p>
                <div className="mt-6">
                  <img
                    className="rounded-lg shadow-xl"
                    src="/api/placeholder/800/400"
                    alt="SpotFlash vision for smart cities"
                  />
                </div>
              </div>
            )}

            {activeTab === "values" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Our Values</h3>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">Innovation</h4>
                    <p className="mt-2 text-gray-600">
                      We constantly seek new ways to improve our technology and service.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">Sustainability</h4>
                    <p className="mt-2 text-gray-600">
                      Reducing environmental impact is central to our business model.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">Accessibility</h4>
                    <p className="mt-2 text-gray-600">
                      Making powerful advertising tools available to businesses of all sizes.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">Integrity</h4>
                    <p className="mt-2 text-gray-600">
                      Honest, transparent relationships with clients, partners and communities.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Timeline */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Journey</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              From a small startup to a leading digital advertising provider in Jordan.
            </p>
          </div>

          <div className="mt-16">
            <div className="flow-root">
              <ul className="-mb-8">
                {milestones.map((milestone, milestoneIdx) => (
                  <li key={milestone.year}>
                    <div className="relative pb-8">
                      {milestoneIdx !== milestones.length - 1 ? (
                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-[#FDB827] flex items-center justify-center ring-8 ring-white">
                            <span className="text-white font-semibold">{milestone.year.substring(2)}</span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 py-0">
                          <div className="text-md text-gray-500 mb-2">{milestone.year}</div>
                          <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                          <p className="mt-1 text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Leadership Team</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the experts behind SpotFlash's innovation and growth.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center">
              <div className="relative pb-2/3 rounded-lg overflow-hidden mb-4">
                <img
                  className="absolute inset-0 h-full w-full object-cover rounded-lg"
                  src={member.image}
                  alt={member.name}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
              <p className="text-[#FDB827] font-medium">{member.role}</p>
              <p className="mt-2 text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#FDB827]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to transform your advertising?</span>
            <span className="block text-white">Let's work together.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#FDB827] bg-white hover:bg-gray-50"
              >
                Contact Us
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="/services"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black bg-opacity-20 hover:bg-opacity-30"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;