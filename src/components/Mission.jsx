import React from "react";
import { IoHeart, IoRibbon, IoPeople } from "react-icons/io5";


const Mission = () => {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white pointer-events-none"></div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Section */}
          <div
            className="w-full lg:w-1/2 transform transition-all duration-700 "
            data-aos="fade-right"
          >
            <img
              src="/img/13.jpg"
              alt="Doctors and nurses at St. Paul's Mission Hospital"
              className="w-full h-auto"
            />
          </div>

          {/* Mission & Values Section */}
          <div
            className="w-full lg:w-1/2"
            data-aos="fade-left"
          >
            <h2 className="text-4xl font-bold text-[#922020] mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              To facilitate the provision of quality, cost-effective, promotive, 
              preventive and curative services to all, particularly the underprivileged, 
              all in accordance with the mission of Christ.
            </p>

            <div className="space-y-6">
              {/* Value Proposition 1 */}
              <div className="flex items-start group">
                <IoHeart
                  size={32}
                  className="text-[#922020] flex-shrink-0 mt-1 transition-transform duration-300 group-hover:scale-125"
                />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Compassionate Care
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Every patient is treated with dignity, empathy, and respect.
                  </p>
                </div>
              </div>

              {/* Value Proposition 2 */}
              <div className="flex items-start group">
                <IoRibbon
                  size={32}
                  className="text-[#922020] flex-shrink-0 mt-1 transition-transform duration-300 group-hover:scale-125"
                />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Excellence in Service
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Delivering high-quality healthcare that is cost-effective and sustainable.
                  </p>
                </div>
              </div>

              {/* Value Proposition 3 */}
              <div className="flex items-start group">
                <IoPeople
                  size={32}
                  className="text-[#922020] flex-shrink-0 mt-1 transition-transform duration-300 group-hover:scale-125"
                />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Community Commitment
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Partnering with the community to promote health and wellbeing for all.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <a
              href="/about"
              className="mt-10 btn-secondary"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
