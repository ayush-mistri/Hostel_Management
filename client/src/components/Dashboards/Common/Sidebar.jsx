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

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* Toggle Button for Mobile */}
      <button
        className={`fixed flex gap-2 md:hidden z-50 top-[1rem] left-20 md:left-20 ml-5 bg-black p-1 w-50 h-50 rounded-full shadow-lg text-white transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-20" : "-translate-x-20"
        }`}
        onClick={toggleMenu}
      >
        <svg
          className={`w-6 h-6 ${isOpen ? "hidden" : "block"}`}
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
        <svg
          className={`w-6 h-6 ${isOpen ? "block" : "hidden"}`}
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
      </button>

      {/* Sidebar */}
      <div
        className={`p-4 flex flex-col justify-between h-screen w-screen absolute md:static bg-black sm:w-64 text-white transition-transform duration-300 ease-in-out z-40 transform ${
          isOpen ? "translate-x-0" : "absolute -translate-x-full"
        }`}
      >
        <div
          to={`/${links[0]?.for}-dashboard`}
          className="w-full flex gap-2 justify-center text-white font-bold rounded-xl text-xl shadow-lg bg-transparent focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 absolute right-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
            />
          </svg>{" "}
          <span className="md:hidden lg:inline">Dashboard</span>
        </div>

        {/* Sidebar Links */}
        <div className="absolute top-20 my-10 px-4 flex flex-col space-y-5 text-1xl text-white">
          {links.map((link) => (
            <Link
              to={link.url}
              key={link.text}
              className={`py-2 px-4 flex items-center gap-2 ${
                location.pathname === link.url
                  ? "text-blue-500"
                  : "hover:text-blue-500"
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
