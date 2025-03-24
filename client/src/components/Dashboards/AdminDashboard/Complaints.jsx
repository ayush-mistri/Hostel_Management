import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Complaints() {
  const getComplaints = async () => {
    const hostel = JSON.parse(localStorage.getItem("hostel"))._id;
    const response = await fetch(`https://hostel-management-ofhb.vercel.app/api/complaint/hostel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hostel }),
    });

    const data = await response.json();
    if (data.success) {
      const complaints = data.complaints.map((complaint) => {
        let date = new Date(complaint.date);
        return {
          id: complaint._id,
          type: complaint.type,
          title: complaint.title,
          desc: complaint.description,
          student: complaint.student.name,
          room: complaint.student.room_no,
          status: complaint.status,
          date: date,
          formattedDate: date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        };
      });

      // Sort complaints by date (newest first)
      complaints.sort((a, b) => b.date - a.date);

      setAllComplaints(complaints);
      setComplaints(complaints.filter((c) => c.status.toLowerCase() === "pending"));
      setResolvedComplaints(complaints.filter((c) => c.status.toLowerCase() !== "pending"));
    } else {
      console.log("Error fetching complaints:", data);
    }
  };

  const [unsolvedComplaints, setComplaints] = useState([]);
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);

  const dismissComplaint = async (id) => {
    const response = await fetch("https://hostel-management-ofhb.vercel.app/api/complaint/resolve/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (data.success) {
      toast.success("Complaint Solved", { autoClose: 2000 });

      setComplaints(unsolvedComplaints.filter((c) => c.id !== id));
      setResolvedComplaints([...resolvedComplaints, ...unsolvedComplaints.filter((c) => c.id === id)]);
    } else {
      toast.error("Something went wrong", { autoClose: 2000 });
    }
  };

  useEffect(() => {
    getComplaints();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center p-4 pt-20 overflow-y-auto">
      <h1 className="text-white font-bold text-4xl sm:text-5xl mb-8">Complaints</h1>

      <div className="w-full h-auto max-w-5xl bg-secondary p-5 rounded-lg shadow-custom-black text-white mb-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white border border-gray-700">
                <th className="p-3 border border-gray-700">Date</th>
                <th className="p-3 border border-gray-700">Student</th>
                <th className="p-3 border border-gray-700">Room</th>
                <th className="p-3 border border-gray-700">Title</th>
                <th className="p-3 border border-gray-700">Description</th>
                <th className="p-3 border border-gray-700">Status</th>
                <th className="p-3 border border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {unsolvedComplaints.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-400">No new complaints!</td>
                </tr>
              ) : (
                unsolvedComplaints.map((complaint) => (
                  <tr key={complaint.id} className="border border-gray-700 text-center">
                    <td className="p-3 text-white border border-gray-700">{complaint.formattedDate}</td>
                    <td className="p-3 text-white border border-gray-700">{complaint.student}</td>
                    <td className="p-3 text-white border border-gray-700">{complaint.room}</td>
                    <td className="p-3 text-white border border-gray-700">{complaint.title}</td>
                    <td className="p-3 text-gray-300 border border-gray-700">{complaint.desc}</td>
                    <td className="p-3 text-yellow-500 border border-gray-700">Pending</td>
                    <td className="p-3">
                      <button
                        className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
                        onClick={() => dismissComplaint(complaint.id)}
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="dark" />
    </div>
  );
}

export default Complaints;
