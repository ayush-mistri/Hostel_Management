import { ShortCard } from "./ShortCard";
import { useEffect, useState } from "react";
import { getAllStudents } from "../../../../utils";

function Home() {
  // Retrieve admin and hostel details from localStorage
  const admin = JSON.parse(localStorage.getItem("admin")) || { name: "admin" };
  const hostel = JSON.parse(localStorage.getItem("hostel")) || {
    name: "hostel",
  };

  // State to store fetched data
  const [allStudents, setAllStudents] = useState([]);
  const [messReqs, setMessReqs] = useState([]);
  const [totalMessRequests, setTotalMessRequests] = useState(0);
  const [totalSuggestions, setTotalSuggestions] = useState(0);
  const [totalComplaints, setTotalComplaints] = useState(0);

  // Fetch all students
  const getAll = async () => {
    try {
      const data = await getAllStudents();
      setAllStudents(data.students || []); // Ensure it's an array or fallback to an empty array
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  // Fetch mess requests
  const getRequests = async () => {
    try {
        const res = await fetch("https://hostel-management-ofhb.vercel.app/api/leave/list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ hostel: hostel._id }),
        });
        const data = await res.json();
        if (data.success) {
            const formattedReqs = data.list.map((req) => ({
                ...req,
                id: req._id,
                from: req.leaving_date ? new Date(req.leaving_date).toDateString().slice(4, 10) : "N/A",
                to: req.return_date ? new Date(req.return_date).toDateString().slice(4, 10) : "Pending",
                _id: req.student._id,
            }));
            setMessReqs(formattedReqs);

            // Set counts
            setTotalMessRequests(data.finalDifference-data.totalReturnedCount);
            console.log("Total Leaving Count:", data.totalLeavingCount);
            console.log("Total Returned Count (return_date NOT NULL):", data.totalReturnedCount);
            console.log("Final Difference (Leaving - Returned):", data.finalDifference);
        }
    } catch (error) {
        console.error("Failed to fetch mess requests:", error);
    }
};



  // Fetch suggestions count
  const fetchSuggestionsCount = async () => {
    try {
      const res = await fetch("https://hostel-management-ofhb.vercel.app/api/suggestion/hostel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hostel: hostel._id }),
      });
      const data = await res.json();
      if (data.success) {
        const pendingSuggestions = data.suggestions.filter(
          (suggestion) => suggestion.status === "pending"
        );
        setTotalSuggestions(pendingSuggestions.length);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    }
  };

  // Fetch complaints count
  const fetchComplaintsCount = async () => {
    try {
      const res = await fetch("https://hostel-management-ofhb.vercel.app/api/complaint/hostel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hostel: hostel._id }),
      });
      const data = await res.json();
      if (data.success) {
        // Filter pending complaints
        const pendingComplaints = data.complaints.filter(
          (complaint) => complaint.status === "pending"
        );
        // Set the count of pending complaints
        setTotalComplaints(pendingComplaints.length);
      }
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    }
  };

  // const fetchTotalMessRequestsCount = async () => {
  //   try {
  //     if (!allStudents.length) return; 
  
  //     let totalCount = 0;
  //     for (const student of allStudents) {
  //       const res = await fetch("https://hostel-management-ofhb.vercel.app/api/messoff/total", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ student: student._id }), // Corrected key
  //       });
  //       const data = await res.json();
  //       if (data.success) {
  //         totalCount += data.count;
  //       }
  //     }
  //     setTotalMessRequests(totalCount);
  //   } catch (error) {
  //     console.error("Failed to fetch total mess requests:", error);
  //   }
  // };
  

  // Fetch all data on component mount
  useEffect(() => {
    getAll();
    getRequests();
    fetchSuggestionsCount();
    fetchComplaintsCount();
    // fetchTotalMessRequestsCount();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-start min-h-screen overflow-x-hidden overflow-y-auto p-4 pt-24 md:pt-20 xl:justify-center">
      <h1 className="text-white font-bold text-5xl text-center">
        Welcome <span className="text-blue-500">{admin.name}!</span>
      </h1>
      <h1 className="text-white text-xl mb-6">Manager, {hostel.name}</h1>
      <div className="flex w-full gap-8 sm:px-20 pt-5 flex-wrap items-center justify-center">
        <ShortCard
          title="Total Students"
          number={allStudents.length}
          path="/admin-dashboard/all-students"
        />
        <ShortCard
          title="Pending Complaints"
          number={totalComplaints}
          path="/admin-dashboard/complaints"
        />
        <ShortCard
          title="Pending Suggestions"
          number={totalSuggestions}
          path="/admin-dashboard/suggestions"
        />
        <ShortCard
          title="Student on a Leave"
          number={totalMessRequests}
          path="/admin-dashboard/mess"
        />
        <ShortCard
          title="Pending Attendance"
          number={totalSuggestions}
          path="/admin-dashboard/attendance"
        />
      </div>
    </div>
  );
}

export default Home;
