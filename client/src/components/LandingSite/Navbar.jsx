import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between p-6 md:px-20 text-white relative mt-2 md:mt-6 z-20">
        {/* Logo */}
        <Link to="/" className="flex items-center text-2xl lg:text-4xl" onClick={() => setMenuOpen(false)}>
          Sahajanand Hostel
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden z-20" onClick={() => setMenuOpen(true)}>
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        {/* Mobile & Desktop Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-1/2 bg-black bg-opacity-95 flex flex-col items-center justify-center space-y-5 text-lg transition-transform duration-300 z-50 ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          } md:translate-y-0 md:relative md:flex-row md:space-y-0 md:space-x-10 md:w-auto md:h-auto md:bg-transparent md:text-lg z-10`}
        >
          {/* Close Button (Only visible in mobile when menu is open) */}
          {menuOpen && (
            <button className="absolute top-4 right-6 text-white md:hidden" onClick={() => setMenuOpen(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <Link to="/about" className="hover:text-blue-500 transition-all ease-linear" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-500 transition-all ease-linear" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
          <Link to="/auth/request" className="hover:text-blue-500 transition-all ease-linear" onClick={() => setMenuOpen(false)}>
            Request
          </Link>
          <Link to="/auth/admin-login" className="hover:text-blue-500 transition-all ease-linear" onClick={() => setMenuOpen(false)}>
            Admin Login
          </Link>
          <Link
            to="/auth/login"
            className="bg-blue-500 hover:bg-blue-700 transition text-white text-lg py-2 px-4 rounded"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      </nav>
    </>
  );
}

export { Navbar };
