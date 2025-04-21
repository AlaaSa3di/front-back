import React from "react";

const DigitalAds = () => {
  const isSubmitting = false;

  return (
    <div className="p-6 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Welcome to Spot Flash
        </h1>
        <p className="text-lg text-gray-600">
          We own more than 50 digital screens
          <br />
          strategically located across Jordan's governorates.
        </p>
        <a
          href="/screens"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-3 rounded-md font-medium text-black transition-colors ${
            isSubmitting
              ? "bg-gray-400"
              : "bg-[#FDB827] hover:bg-[#F26B0F]/90"
          } inline-block text-center max-w-xs`}
        >
          Advertise Now
        </a>
      </section>

      {/* Screens Section */}
      <section className="space-y-10">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Our Digital Screens
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              img: "images/Outside.jpeg",
              title: "Outside Digital Screen",
              size: "15m x 8m",
              link: "html/outside.html",
            },
            {
              img: "images/inside.jpeg",
              title: "Inside Digital Screen",
              size: "9m x 2m",
              link: "html/inside.html",
            },
            {
              img: "images/mini.jpeg",
              title: "Mini Digital Screen",
              size: "75in",
              link: "html/mini.html",
            },
          ].map((screen, index) => (
            <div
              key={index}
              className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
            >
              <img src={screen.img} alt={screen.title} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {screen.title}
                </h3>
                <p className="text-sm text-gray-600">Size: {screen.size}</p>
                <a
                  href={screen.link}
                  className="inline-block mt-4 text-[#FDB827] font-medium hover:text-[#F26B0F]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  More Details
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a
            href="html/product.html"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-3 rounded-md font-medium text-black transition-colors ${
              isSubmitting
                ? "bg-gray-400"
                : "bg-[#FDB827] hover:bg-[#F26B0F]/90"
            } inline-block max-w-xs`}
          >
            View All Screens
          </a>
        </div>
      </section>

      {/* Why Digital Screens Section */}
      <section className="space-y-10">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Why Choose Digital Screens?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: "fa-regular fa-life-ring",
              title: "Target Advertising",
              desc: "Our platform allows for precise targeting to reach your desired audience effectively.",
            },
            {
              icon: "fa-solid fa-repeat",
              title: "Dynamic Content",
              desc: "Utilize dynamic content that adapts to user behavior and preferences for a more engaging experience.",
            },
            {
              icon: "fa-solid fa-chart-line",
              title: "Cost Effective",
              desc: "Our solution offers cost-effective advertising options without compromising reach or effectiveness.",
            },
            {
              icon: "fa-regular fa-clock",
              title: "Flexibility & Real-time Updates",
              desc: "Easily update and customize your campaigns in real-time to keep your content fresh and relevant.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-2xl text-center hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4" style={{ color: "#FDB827" }}>
                <i className={item.icon}></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DigitalAds;
