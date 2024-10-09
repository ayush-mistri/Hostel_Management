import { ShortCard } from "./ShortCard";
import { useEffect, useState } from "react";
import { getAllStudents } from "../../../../utils";

function Home() {
  // Retrieve admin and hostel details from localStorage
  const admin = JSON.parse(localStorage.getItem("admin")) || { name: "admin" };
  const hostel = JSON.parse(localStorage.getItem("hostel")) || { name: "hostel" };

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
      const res = await fetch("http://localhost:3000/api/messoff/list", {
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
          from: new Date(req.leaving_date).toDateString().slice(4, 10),
          to: new Date(req.return_date).toDateString().slice(4, 10),
          _id: req.student._id,
        }));
        setMessReqs(formattedReqs);
        setTotalMessRequests(data.list.length);
      }
    } catch (error) {
      console.error("Failed to fetch mess requests:", error);
    }
  };

  // Fetch suggestions count
  const fetchSuggestionsCount = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/suggestion/hostel", {
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
    const res = await fetch("http://localhost:3000/api/complaint/hostel", {
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


  // Fetch total mess requests count
  const fetchTotalMessRequestsCount = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/messoff/total", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hostelId: hostel._id }),
      });
      const data = await res.json();
      if (data.success) {
        setTotalMessRequests(data.count);
      }
    } catch (error) {
      console.error("Failed to fetch total mess requests:", error);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    getAll();
    getRequests();
    fetchSuggestionsCount();
    fetchComplaintsCount();
    fetchTotalMessRequestsCount();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-center max-h-screen overflow-x-hidden overflow-y-auto pt-[400px] sm:pt-96 md:pt-96 lg:pt-80 xl:pt-20">
      <h1 className="text-white font-bold text-5xl text-center">
        Welcome <span className="text-blue-500">{admin.name}!</span>
      </h1>
      <h1 className="text-white text-xl">Manager, {hostel.name}</h1>
      <div className="flex w-full gap-8 sm:px-20 pt-5 flex-wrap items-center justify-center">
        <ShortCard title="Total Students" number={allStudents.length} />
        <ShortCard title="Pending Complaints" number={totalComplaints} />
        <ShortCard title="Pending Suggestions" number={totalSuggestions} />
        <ShortCard title="Pending Mess Requests" number={totalMessRequests} />
        <ShortCard title="Pending Attendance" number={totalSuggestions} />
      </div>
    </div>
  );
}

export default Home;
