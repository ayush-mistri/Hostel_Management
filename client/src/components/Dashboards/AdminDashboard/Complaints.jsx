import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
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
      console.log("Complaints fetched:", data.complaints); // Check fetched complaints
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
          date: date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        };
      });

      setAllComplaints(complaints);

      const pendingComplaints = complaints.filter(
        (complaint) => complaint.status.toLowerCase() === "pending"
      );
      console.log("Pending complaints:", pendingComplaints); // Log pending complaints
      setComplaints(pendingComplaints);

      const resolved = complaints.filter(
        (complaint) => complaint.status.toLowerCase() !== "pending"
      );
      setResolvedComplaints(resolved);
    } else {
      console.log("Error fetching complaints:", data);
    }
  };

  //!AFTER FETCH FILL THIS WITH COMPLAINT DATA
  const [unsolvedComplaints, setComplaints] = useState([]);

  const [resolvedComplaints, setResolvedComplaints] = useState([]); //!DO NOT FILL THIS WITH DATA FROM FETCH
  const [allComplaints, setAllComplaints] = useState([]); //!AFTER FETCH FILL THIS WITH COMPLAINT DATA

  const dismissComplaint = async (id) => {
    const response = await fetch(
      "https://hostel-management-ofhb.vercel.app/api/complaint/resolve/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    const data = await response.json();
    if (data.success) {
      toast.success("Complaint Solved", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setComplaints(allComplaints.filter((complaint) => complaint.id !== id));
      setResolvedComplaints(
        resolvedComplaints.concat(
          allComplaints.filter((complaint) => complaint.id === id)
        )
      );
    } else {
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const [graphData, setGraphData] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    getComplaints();
    const dates = [
      new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        { day: "numeric", month: "long", year: "numeric" }
      ),
      new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        { day: "numeric", month: "long", year: "numeric" }
      ),
      new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        { day: "numeric", month: "long", year: "numeric" }
      ),
      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        { day: "numeric", month: "long", year: "numeric" }
      ),
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        { day: "numeric", month: "long", year: "numeric" }
      ),
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        { day: "numeric", month: "long", year: "numeric" }
      ),
      new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "en-US",
        { day: "numeric", month: "long", year: "numeric" }
      ),
    ];

    const labels = dates.map((date) => date);
    setGraphData(
      labels.map(
        (date) =>
          allComplaints.filter((complaint) => complaint.date === date).length
      )
    );
  }, [
    allComplaints.length,
    unsolvedComplaints.length,
    resolvedComplaints.length,
  ]);

  const graph = (
    <div className="flex items-center justify-center md:h-64 h-40 md:w-96 w-full">
      <Line
        data={{
          labels: [
            new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString(
              "en-US",
              { day: "numeric", month: "long", year: "numeric" }
            ),
            new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
              "en-US",
              { day: "numeric", month: "long", year: "numeric" }
            ),
            new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
              "en-US",
              { day: "numeric", month: "long", year: "numeric" }
            ),
            new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
              "en-US",
              { day: "numeric", month: "long", year: "numeric" }
            ),
            new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(
              "en-US",
              { day: "numeric", month: "long", year: "numeric" }
            ),
            new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(
              "en-US",
              { day: "numeric", month: "long", year: "numeric" }
            ),
            new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toLocaleDateString(
              "en-US",
              { day: "numeric", month: "long", year: "numeric" }
            ),
          ],
          datasets: [
            {
              label: "No. of Complaints",
              pointHoverBackgroundColor: "orange",
              data: graphData,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );

  return (
    <div className="w-full h-screen flex flex-col gap-4 items-center justify-center">
      <h1 className="text-white font-bold text-5xl">Complaints</h1>
      <div className="">
        {/* {graph} */}
        <div className="bg-secondary px-10 py-5 rounded-xl shadow-custom-black sm:w-[50%] sm:min-w-[640px] w-full mt-6 max-h-96 overflow-auto">
          <span className="text-white font-bold text-xl">New Complaints</span>
          <ul role="list" className="divide-y divide-gray-700 text-white">
            {unsolvedComplaints.length === 0
              ? "No new complaints!"
              : unsolvedComplaints.map((complaint) => (
                  <li
                    className="my-2 py-3 sm:py-2 px-5 rounded hover:bg-highlight hover:scale-105 transition-all"
                    key={complaint.student}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-7 h-7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate text-white">
                          {complaint.student}
                        </span>
                        <span className="p-2 text-sm font-medium truncate text-white">
                          [ Room : {complaint.room} ]
                        </span>
                        <p className="text-sm font-medium truncate text-white">
                          {complaint.title}
                        </p>
                        <p className="text-sm truncate text-gray-400">
                          {complaint.desc}
                        </p>
                      </div>
                      <button
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded"
                        onClick={() => dismissComplaint(complaint.id)}
                      >
                        {/* Pending SVG Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 animate-spin"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.75V12m0 0h7.25"
                          />
                          <circle cx="12" cy="12" r="9" stroke="currentColor" />
                        </svg>
                        {/* Button Text */}
                        Pending
                      </button>
                    </div>
                  </li>
                ))}
          </ul>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="dark"
      />
    </div>
  );
}

export default Complaints;
