import { useEffect, useState } from "react";
import { Input } from "../../LandingSite/AuthPage/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Leave() {
  const [leaveDate, setLeaveDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [requests, setRequests] = useState(0);
  const [Messoff, setMessOff] = useState(0);
  const [loading, setLoading] = useState(false);
  const [requestsList, setRequestsList] = useState([]);
  const [dateType, setDateType] = useState("leave"); // "leave" or "return"

  const fetchRequestsList = async () => {
    const student = JSON.parse(localStorage.getItem("student"));
    if (student) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/leave/count", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student: student._id }),
        });

        const result = await response.json();
        if (result.success) {
          setMessOff(result.approved);
          setRequests(result.list.length);

          // Always sort requests by newest first
          const sortedList = result.list.sort((a, b) => new Date(b.request_date) - new Date(a.request_date));

          setRequestsList(sortedList);
        }

      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRequestsList();
  }, []);

  useEffect(() => {
    if (requestsList.length > 0) {
      const latestRequest = requestsList.sort(
        (a, b) => new Date(b.request_date) - new Date(a.request_date)
      )[0]; // Get the latest request
      console.log("Latest Request:", latestRequest);
    }
  }, [requestsList]); // Runs whenever requestsList updates


  console.log("Sending Data:", {
    student: JSON.parse(localStorage.getItem("student"))?._id,
    leaving_date: leaveDate,
    return_date: returnDate,
  });

  const lastLeaveRequest = requestsList
    .filter((req) => req.leaving_date && !req.return_date)
    .sort((a, b) => new Date(b.leaving_date) - new Date(a.leaving_date))[0]; // Get the latest request

  const lastLeaveDate = lastLeaveRequest ? lastLeaveRequest.leaving_date : null; // Ensure it's defined

  console.log("Latest Leave Date:", lastLeaveDate); // Debugging


  const requestMessOff = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const studentData = JSON.parse(localStorage.getItem("student"));
    if (!studentData || !studentData._id) {
      toast.error("Student data missing. Please log in again.");
      setLoading(false);
      return;
    }
  
    // Get the latest request
    const lastRequest = requestsList
      .sort((a, b) => new Date(b.request_date) - new Date(a.request_date))[0];
  
    // Check if last request was a leave or return
    const lastWasLeave = lastRequest?.leaving_date && !lastRequest?.return_date;
    const lastWasReturn = lastRequest?.leaving_date && lastRequest?.return_date;
  
    // Enforce alternating leave and return requests
    if (dateType === "leave" && lastWasLeave) {
      toast.error("You must submit a return date before requesting another leave.");
      setLoading(false);
      return;
    }
  
    if (dateType === "return" && !lastWasLeave) {
      toast.error("You must submit a leave request before setting a return date.");
      setLoading(false);
      return;
    }
  
    let requestData = { student: studentData._id };
  
    if (dateType === "leave") {
      if (!leaveDate) {
        toast.error("Please select a valid leave date.");
        setLoading(false);
        return;
      }
      requestData.leaving_date = leaveDate;
    } else if (dateType === "return") {
      if (!lastWasLeave) {
        toast.error("You must have a leave request before setting a return date.");
        setLoading(false);
        return;
      }
  
      if (!returnDate) {
        toast.error("Please select a valid return date.");
        setLoading(false);
        return;
      }
  
      if (new Date(returnDate).setHours(0, 0, 0, 0) <= new Date(lastRequest.leaving_date).setHours(0, 0, 0, 0)) {
        toast.error("Return date must be after your last leave date.");
        setLoading(false);
        return;
      }
  
      requestData.leaving_date = lastRequest.leaving_date; // Maintain the previous leave date
      requestData.return_date = returnDate;
    }
  
    console.log("Sending Data:", requestData);
  
    try {
      const response = await fetch("http://localhost:3000/api/leave/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      const result = await response.json();
      if (result.success) {
        setLeaveDate("");
        setReturnDate("");
        toast.success("Mess Off Requested Successfully!");
        fetchRequestsList(); // Refresh list after request
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="w-full h-screen flex flex-col items-center justify-start bg-primary p-6 overflow-y-auto pt-20">
      <h1 className="text-white font-bold text-3xl sm:text-4xl mb-6">Leave Requests</h1>

      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl items-start">
        {/* Form Section */}
        <form
          onSubmit={requestMessOff}
          className="lg:w-1/2 w-full pt-6 py-5 pb-7 px-10 bg-secondary rounded-lg shadow-custom-black flex flex-col gap-3"
        >
          <h2 className="text-white font-semibold text-xl mb-2">Request Leave</h2>

          {/* Dropdown to Select Leave or Return */}
          <select
            value={dateType}
            onChange={(e) => {
              setDateType(e.target.value);
              if (e.target.value === "return" && lastLeaveDate) {
                setLeaveDate(lastLeaveDate); // Auto-set leaving_date when selecting return
              }
            }}
            className="w-full p-2 rounded-lg bg-highlight text-white text-sm"
          >
            <option value="leave">Leave Date & Time</option>
            <option value="return">Return Date & Time</option>
          </select>

          {/* Conditional Input for Leave or Return Date */}
          {dateType === "leave" && (
            <Input
              field={{
                name: "Leaving Date & Time",
                type: "datetime-local",
                value: leaveDate ? leaveDate.slice(0, 16) : "",
                onChange: (e) => setLeaveDate(e.target.value),
              }}
            />
          )}

          {dateType === "return" && (
            <>

              {/* Return Date */}
              <Input
                field={{
                  name: "Return Date & Time",
                  type: "datetime-local",
                  value: returnDate ? returnDate.slice(0, 16) : "",
                  min: lastLeaveDate ? new Date(lastLeaveDate).toISOString().slice(0, 16) : "",
                  disabled: !lastLeaveDate,
                  onChange: (e) => setReturnDate(e.target.value),
                }}
              />
            </>
          )}
          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </form>

        {/* Requests Table */}
        <div className="w-full bg-secondary p-6 rounded-lg shadow-lg overflow-x-auto">
          <h2 className="text-white font-semibold text-lg mb-3">All Requests</h2>
          <table className="w-full text-white border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-2">Leaving Date</th>
                <th className="p-2 border-r border-gray-700">Leaving Time</th>
                <th className="p-2 border-l border-gray-700">Return Date</th>
                <th className="p-2">Return Time</th>
                {/* <th className="p-2 border-l border-gray-700">Request Date</th>
    <th className="p-2">Request Time</th> */}
              </tr>
            </thead>

            <tbody>
              {requestsList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-2">No requests sent</td>
                </tr>
              ) : (
                requestsList.map((req) => (
                  <tr key={req._id} className="border border-gray-700 text-center">
                    {/* Leaving Date */}
                    <td className="p-2">
                      {req.return_date ? "-" : req.leaving_date ? new Date(req.leaving_date).toDateString().slice(4, 10) : "-"}
                    </td>

                    {/* Leaving Time */}
                    <td className="p-2 p-2 border-l border-gray-700">
                      {req.return_date ? "-" : req.leaving_date ? new Date(req.leaving_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) : "-"}
                    </td>

                    {/* Return Date */}
                    <td className="p-2 p-2 border-l border-gray-700">
                      {req.return_date ? new Date(req.return_date).toDateString().slice(4, 10) : "-"}
                    </td>

                    {/* Return Time */}
                    <td className="p-2 p-2 border-l border-gray-700">
                      {req.return_date ? new Date(req.return_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) : "-"}
                    </td>

                    {/* Request Date */}
                    {/* <td className="p-2">
                      {new Date(req.request_date).toDateString().slice(4, 10)}
                    </td> */}

                    {/* Request Time */}
                    {/* <td className="p-2">
                      {new Date(req.request_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover theme="dark" />
    </div>

  );
}

export default Leave;
