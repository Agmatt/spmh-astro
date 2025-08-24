import React from 'react';
import { IoLocationSharp, IoCall, IoMail } from 'react-icons/io5';

/**
 * A simple, professional footer component for a hospital website.
 * It includes essential links, contact information, and a copyright notice.
 */
const App = () => {
  return (
    <footer className="bg-[#4d0c0c] text-gray-300 py-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-b border-gray-600 pb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">About Us</h3>
            <p className="text-sm leading-relaxed">
              Serving the community with compassionate, affordable, and accessible healthcare since the 1960s. We are committed to your well-being.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-white transition-colors duration-300">Our Mission</a></li>
              <li><a href="/services" className="hover:text-white transition-colors duration-300">Services</a></li>
              <li><a href="/team" className="hover:text-white transition-colors duration-300">Our Team</a></li>
              <li><a href="/news" className="hover:text-white transition-colors duration-300">News & Blog</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <IoLocationSharp className="mr-2 text-white" />
                123 Mission Lane, Homa Bay, Kenya
              </li>
              <li className="flex items-center">
                <IoCall className="mr-2 text-white" />
                +254 712 345 678
              </li>
              <li className="flex items-center">
                <IoMail className="mr-2 text-white" />
                info@stpaulshospital.org
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center pt-8 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} St. Paul’s Mission Hospital| All Rights Reserved | <span className="text-teal-400">Designed by Editorial Team</span></p>
        </div>
      </div>
    </footer>
  );
};

export default App;
