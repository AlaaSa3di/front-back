import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import logo from "../images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto pt-12 pb-8 px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Company Info */}
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <img src={logo} alt="Digital Screens Logo" className="h-10" />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              The leading platform for outdoor digital advertising in Jordan.
            </p>
            <button
              className={`w-full py-3 rounded-md font-medium text-black transition-colors bg-[#FDB827] hover:bg-[#F26B0F]/90`}
            >
              Contact Us
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FDB827] border-b border-[#FDB827]/30 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/screens"
                  className="hover:text-[#FDB827] transition duration-300"
                >
                  Browse Screens
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="hover:text-[#FDB827] transition duration-300"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-[#FDB827] transition duration-300"
                >
                  Terms & Policy
                </a>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FDB827] border-b border-[#FDB827]/30 pb-2">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MdLocationOn className="mt-1 mr-2 text-[#FDB827]" />
                <span>Zarqa, Jordan</span>
              </li>
              <li className="flex items-center">
                <MdEmail className="mr-2 text-[#FDB827]" />
                <a
                  href="mailto:spot.flash2025@gmail.com"
                  className="hover:text-[#FDB827]"
                >
                  spot.flash2025@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <MdPhone className="mr-2 text-[#FDB827]" />
                <a href="tel:+962786860863" className="hover:text-[#FDB827]">
                  +962 78 686 0863
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 my-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} Digital Screens. All rights reserved.
          </div>

          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              className="bg-gray-800 hover:bg-[#FDB827] p-2 rounded-full text-gray-300 hover:text-gray-900"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href="https://instagram.com"
              className="bg-gray-800 hover:bg-[#FDB827] p-2 rounded-full text-gray-300 hover:text-gray-900"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="https://wa.me/962786860863"
              className="bg-gray-800 hover:bg-[#FDB827] p-2 rounded-full text-gray-300 hover:text-gray-900"
            >
              <FaWhatsapp size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
