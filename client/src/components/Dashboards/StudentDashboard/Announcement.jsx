import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/announcement");
        const data = await response.json();

        if (data.success) {
          setAnnouncements(data.announcements);
        } else {
          toast.error(data.message || "Failed to fetch announcements.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
          });
        }
      } catch (error) {
        toast.error("Server error, please try again later.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col gap-4 items-center justify-center">
      <h1 className="text-white font-bold text-5xl">Announcements</h1>
      {loading ? (
        <p className="text-white text-lg">Loading announcements...</p>
      ) : announcements.length > 0 ? (
        <div className="sm:w-[50%] w-full py-5 px-10 bg-secondary rounded-xl shadow-custom-black mt-6 max-h-96 overflow-auto">
          <span className="text-white font-bold text-xl">Latest Announcements</span>
          <ul role="list" className="divide-y divide-gray-700 text-white">
            {announcements.map((announcement) => (
              <li
                className="my-2 py-3 sm:py-2 px-5 rounded hover:bg-highlight hover:scale-105 transition-all"
                key={announcement._id}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text- font-medium truncate text-white">
                      title : {announcement.title}
                    </h2>
                    <p className="text-sm truncate text-gray-400">
                    description : {announcement.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-white text-lg">No announcements available.</p>
      )}
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}

export default StudentAnnouncements;
