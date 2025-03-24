import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

Sidebar.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      for: PropTypes.string.isRequired,
      svg: PropTypes.element.isRequired,
    })
  ).isRequired,
};

function Sidebar({ links }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative">
      {/* Toggle Button (Mobile Only) */}
      <button
        className="fixed top-2 left-4 md:hidden z-50 bg-black p-2 rounded-full shadow-lg text-white transition-transform"
        onClick={toggleMenu}
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static left-0 h-screen bg-black text-white w-64 p-6 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } z-40`}
      >
        {/* Sidebar Links */}
        <div className="mt-20 space-y-4">
          {links.map((link) => (
            <Link
              to={link.url}
              key={link.text}
              onClick={() => setIsOpen(false)} // Close sidebar on click
              className={`flex items-center gap-3 py-2 px-4 rounded-md transition-all ${location.pathname === link.url
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-700"
                }`}
            >
              {link.svg}
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export { Sidebar };
