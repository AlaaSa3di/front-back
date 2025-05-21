import { useState } from "react";

const About = () => {
  const [activeTab, setActiveTab] = useState("mission");

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.pexels.com/photos/12453979/pexels-photo-12453979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Sarah founded SpotFlash with a vision to transform the advertising landscape through innovative digital solutions. With over 15 years of experience in marketing and technology."
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image: "https://images.pexels.com/photos/12453979/pexels-photo-12453979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Michael oversees all technical aspects of SpotFlash, from platform development to hardware integration. His background in IoT and digital signage has been instrumental to our success."
    },
    {
      name: "Amira Al-Hassan",
      role: "Creative Director",
      image: "https://images.pexels.com/photos/12453979/pexels-photo-12453979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Amira brings creative excellence to every campaign. Her award-winning designs and strategic approach help our clients achieve maximum impact with their digital advertising."
    },
    {
      name: "David Okafor",
      role: "Head of Business Development",
      image: "https://images.pexels.com/photos/12453979/pexels-photo-12453979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "David builds strong partnerships that expand our reach. His deep understanding of the advertising market helps businesses of all sizes unlock their digital potential."
    }
  ];
  
  const stats = [
    { number: "50+", label: "Digital Displays Installed" },
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
                src="https://images.pexels.com/photos/2380784/pexels-photo-2380784.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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
    </div>
  );
};

export default About;