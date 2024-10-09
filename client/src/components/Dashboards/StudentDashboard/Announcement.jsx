import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "../Common/Loader";

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/announcements");
      const data = await response.json();
      if (data.success) {
        setAnnouncements(data.announcements);
      } else {
        toast.error("Failed to fetch announcements.");
      }
    } catch (error) {
      toast.error("Server error, please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    getAnnouncements();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-center">
      <ToastContainer />
      <h1 className="text-white font-bold text-5xl">Announcements</h1>

      <div className="bg-secondary px-10 py-5 rounded-xl shadow-xl sm:w-[50%] sm:min-w-[450px] w-full mt-5 max-h-96 overflow-auto">
        <span className="text-white font-bold text-xl">All Announcements</span>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-700 text-white">
            {announcements.length === 0
              ? "No Announcements Found"
              : announcements.map((announcement) => (
                  <li
                    className="my-2 py-2 px-5 rounded sm:py-1 hover:bg-highlight hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
                    key={announcement._id}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-white">
                          {announcement.title}
                        </p>
                        <p className="text-xs text-gray-400">{announcement.description}</p>
                      </div>
                    </div>
                  </li>
                ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Announcement;
