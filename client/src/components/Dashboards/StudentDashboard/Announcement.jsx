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
          const sortedAnnouncements = data.announcements.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setAnnouncements(sortedAnnouncements);
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
    <div className="w-full h-screen flex flex-col items-center p-4 pt-20 overflow-y-auto">
      <h1 className="text-white font-bold text-3xl md:text-5xl mb-8">Announcements</h1>

      {loading ? (
        <p className="text-white text-lg mt-4">Loading announcements...</p>
      ) : announcements.length > 0 ? (
        <div className="w-full h-auto max-w-4xl bg-secondary p-5 rounded-lg shadow-lg text-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse border border-gray-700 text-center">
              <thead>
                <tr className="bg-gray-800 text-xl">
                  <th className="border border-gray-700 p-3">Title</th>
                  <th className="border border-gray-700 p-3">Description</th>
                  <th className="border border-gray-700 p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((announcement) => (
                  <tr key={announcement._id} className="bg-gray-900">
                    <td className="px-6 py-4 border border-gray-700 text-center font-medium">
                      {announcement.title}
                    </td>
                    <td className="px-6 py-4 border border-gray-700 text-center">
                      {announcement.description}
                    </td>
                    <td className="px-6 py-4 border border-gray-700 text-center">
                      <span className="text-yellow-400">
                        {new Date(announcement.date).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-white text-lg mt-4">No announcements available.</p>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>

  );
}

export default StudentAnnouncements;