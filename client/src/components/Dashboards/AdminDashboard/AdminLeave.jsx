import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "react-top-loading-bar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminLeave() {
  const [progress, setProgress] = useState(0);
  const [newReqs, setNewReqs] = useState([]);
  const [pdfMessage, setPdfMessage] = useState("");

  const generatePDF = (last10Entries) => {
    try {
      const doc = new jsPDF();
      doc.text("Mess Off Requests", 14, 10);

      const tableColumn = ["Submitted On", "Student Name", "Room No", "From", "To"];
      const tableRows = [];

      last10Entries.forEach((req) => {
        const rowData = [req.submittedOn, req.student.name, req.student.room_no, req.from, req.to];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: "grid",
      });

      doc.save("Leave.pdf");

      // ✅ Store processed IDs in localStorage
      let processedIds = JSON.parse(localStorage.getItem("processedLeaveRequests")) || [];
      processedIds = [...processedIds, ...last10Entries.map((req) => req.id)];
      localStorage.setItem("processedLeaveRequests", JSON.stringify(processedIds));

      // ✅ Show message and remove entries from UI
      setPdfMessage("PDF has been generated for the last 10 requests.");
      setNewReqs((prevReqs) => prevReqs.slice(0, -10));

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Something went wrong!");
    }
  };

  const getRequests = async () => {
    setProgress(30);
    const hostel = JSON.parse(localStorage.getItem("hostel"));
    const res = await fetch("http://localhost:3000/api/leave/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostel: hostel._id }),
    });
    setProgress(50);
    const data = await res.json();

    if (data.success) {
      let sortedList = data.list.sort(
        (a, b) => new Date(b.request_date) - new Date(a.request_date)
      );

      sortedList.forEach((req) => {
        req.id = req._id;
        req.submittedOn = req.request_date
            ? new Date(req.request_date).toLocaleString("en-GB", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit", hour12: true
            }).replace(" am", " AM").replace(" pm", " PM")
            : "-";
    
        req.leavingDate = req.leaving_date
            ? new Date(req.leaving_date).toLocaleDateString("en-GB")
            : "-";
        req.leavingTime = req.leaving_date
            ? new Date(req.leaving_date).toLocaleTimeString("en-GB", {
                hour: "2-digit", minute: "2-digit", hour12: true
            }).replace(" am", " AM").replace(" pm", " PM")
            : "-";
    
        req.returnDate = req.return_date
            ? new Date(req.return_date).toLocaleDateString("en-GB")
            : "-";
        req.returnTime = req.return_date
            ? new Date(req.return_date).toLocaleTimeString("en-GB", {
                hour: "2-digit", minute: "2-digit", hour12: true
            }).replace(" am", " AM").replace(" pm", " PM")
            : "-";
    
        req._id = req.student._id;
    });
    


      // ✅ Filter out already processed requests
      let processedIds = JSON.parse(localStorage.getItem("processedLeaveRequests")) || [];
      let unprocessedRequests = sortedList.filter((req) => !processedIds.includes(req.id));

      setNewReqs(unprocessedRequests);

      // ✅ If at least 10 new unprocessed requests exist, generate PDF
      if (unprocessedRequests.length >= 100) {
        generatePDF(unprocessedRequests.slice(-10));
      }
    }
    setProgress(100);
  };


  useEffect(() => {
    getRequests();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center bg-primary p-8 overflow-y-auto pt-16">
      <LoadingBar color="#1E40AF" progress={progress} onLoaderFinished={() => setProgress(0)} />

      <h1 className="text-white font-bold text-4xl mt-5">Leave</h1>

      {/* ✅ Dismissible PDF Message */}
      {pdfMessage && (
        <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg mt-4 flex justify-between w-full max-w-md">
          {pdfMessage}
          <button
            onClick={() => setPdfMessage("")}
            className="ml-4 text-black font-bold"
          >
            ✖
          </button>
        </div>
      )}

      <div className="w-full h-auto max-w-5xl mt-6 p-6 bg-secondary rounded-xl shadow-custom-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-semibold">All Requests</h2>
        </div>

        {newReqs.length === 0 ? (
          <p className="text-gray-400">No new requests</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-white border-collapse border border-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th rowSpan="2" className="px-4 py-2 text-center border border-gray-600">Student Name</th>
                  <th rowSpan="2" className="px-4 py-2 text-center border border-gray-600">Room No</th>
                  <th colSpan="2" className="px-4 py-2 border border-gray-600">Leaving</th>
                  <th colSpan="2" className="px-4 py-2 border border-gray-600">Return</th>
                </tr>
                <tr>
                  <th className="px-4 py-2 border border-gray-600">Date</th>
                  <th className="px-4 py-2 border border-gray-600">Time</th>
                  <th className="px-4 py-2 border border-gray-600">Date</th>
                  <th className="px-4 py-2 border border-gray-600">Time</th>
                </tr>
              </thead>
              <tbody>
                {newReqs.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-700 transition">
                    {/* <td className="px-4 py-2 text-center border border-gray-600">{req.submittedOn}</td> */}
                    <td className="px-4 py-2 text-center border border-gray-600">{req.student.name}</td>
                    <td className="px-4 py-2 text-center border border-gray-600">{req.student.room_no}</td>
                    <td className="p-2 text-center border border-gray-600">
                      {req.return_date
                        ? "-"
                        : req.leaving_date
                          ? new Date(req.leaving_date).toLocaleDateString("en-GB")
                          : "-"}
                    </td>
                    <td className="p-2 text-center border border-gray-600">
                      {req.return_date
                        ? "-"
                        : req.leaving_date
                          ? new Date(req.leaving_date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          : "-"}
                    </td>

                    <td className="px-4 py-2 text-center border border-gray-600">{req.returnDate}</td>
                    <td className="px-4 py-2 text-center border border-gray-600">{req.returnTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}

export default AdminLeave;
