import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { User, LogOut } from "lucide-react"; // Importing icons

Topbar.propTypes = {
  name: PropTypes.string,
  notifications: PropTypes.array,
};

function Topbar({ name, notifications }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("hostel");
    localStorage.removeItem("student");
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-menu")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="py-4 px-6 md:px-10 flex items-center justify-between text-white w-full bg-black shadow-custom-blue fixed top-0 left-0 right-0 z-50">
      <div className="mr-auto text-xl font-semibold invisible md:visible">
        {localStorage.getItem("admin")
          ? "Admin Dashboard"
          : localStorage.getItem("student")
            ? "Student Dashboard"
            : ""}
      </div>


      <div className="flex gap-4 items-center">
        <Link to="settings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 hover:text-blue-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>

        {/* Profile Dropdown */}
        <div className="relative top-1 profile-menu">
          <button onClick={toggleDropdown} className="focus:outline-none">
            <User className="w-6 h-6 hover:text-blue-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute bg-gray-800 top-8 right-0 flex flex-col rounded-xl shadow-lg w-32">
              <Link
                to="profile"
                className="flex items-center gap-2 pt-2 pb-2 hover:bg-gray-700 hover:rounded-xl text-white px-4"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="w-5 h-5" /> Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
                className="flex items-center gap-2 pb-3 pt-2 hover:bg-gray-700 hover:rounded-xl text-white px-4 w-full text-left"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { Topbar };
