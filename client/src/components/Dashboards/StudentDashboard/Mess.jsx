import { useEffect, useState } from "react";
import { Input } from "../../LandingSite/AuthPage/Input";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto"; // !IMPORTANT
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Mess() {
  const [leaveDate, setLeaveDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [requests, setRequests] = useState(0);
  const [Messoff, setMessOff] = useState(0);
  const [loading, setLoading] = useState(false);
  const [requestsList, setRequestsList] = useState([]);

  const daysofmonthtilltoday = new Date().getDate();

  const leavingDate = {
    name: "leaving date",
    placeholder: "",
    req: true,
    type: "date",
    value: leaveDate,
    onChange: (e) => setLeaveDate(e.target.value),
  };

  const returningDate = {
    name: "return date",
    placeholder: "",
    req: true,
    type: "date",
    value: returnDate,
    onChange: (e) => setReturnDate(e.target.value),
  };

  useEffect(() => {
  fetchRequestsList();
}, []);

const fetchRequestsList = async () => {
  const student = JSON.parse(localStorage.getItem("student"));
  if (student) {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/Messoff/count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student: student._id }),
      });

      const result = await response.json();
      console.log("Fetch requests result:", result); // Log the result
      if (result.success) {
        setMessOff(result.approved);
        setRequests(result.list.length);
        setRequestsList(result.list);
        console.log("Requests List:", result.list); // Log the updated list
      } else {
        alert(result.errors[0].msg);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  }
};

useEffect(() => {
  console.log("Requests List updated:", requestsList); // Log the updated list
}, [requestsList]);


  const requestMessOff = async (event) => {
    event.preventDefault();
    setLoading(true);

    const data = {
      student: JSON.parse(localStorage.getItem("student"))._id,
      leaving_date: leaveDate,
      return_date: returnDate,
    };

    try {
      const response = await fetch("http://localhost:3000/api/Messoff/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setLeaveDate("");
        setReturnDate("");
        toast.success("Mess Off Requested Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

        // Re-fetch the requests list
        fetchRequestsList();
      } else {
        toast.error(result.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const loader = (
    <svg
      aria-hidden="true"
      className="inline w-4 h-4 mr-2 animate-spin text-white fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* SVG paths... */}
    </svg>
  );

  return (
    <div className="w-full h-screen gap-8 flex flex-col items-center justify-center max-h-screen overflow-y-auto pt-[500px] sm:pt-96 md:pt-96 lg:pt-0">
      <h1 className="text-white font-bold text-5xl">Mess Off</h1>
      <ul className="flex gap-5 text-white text-xl px-5 sm:p-0 text-center">
        <li>Total Mess: {daysofmonthtilltoday - Messoff}</li>
        <li>Mess Off: {loading ? loader : Messoff}</li>
        <li>Requests Sent: {loading ? loader : requests}</li>
      </ul>

      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 flex-wrap">
        <div className="w-full sm:w-80 max-w-md max-h-60 p-4 border rounded-lg shadow-custom-black sm:p-8 bg-secondary border-neutral-900 drop-shadow-xl overflow-y-auto">
          <h5 className="text-xl font-bold leading-none text-white">All Requests</h5>
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-700 text-white">
              {requestsList.length === 0
                ? "No requests Sent"
                : requestsList.map((req) => (
                    <li className="py-3 sm:py-4" key={req._id}>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-white">
                            {req.status.toUpperCase()}
                          </p>
                          <p className="text-sm truncate text-gray-400">
                            {new Date(req.leaving_date).toDateString().slice(4, 10)} to{" "}
                            {new Date(req.return_date).toDateString().slice(4, 10)}
                          </p>
                        </div>
                        <div className="flex flex-col items-center text-base font-semibold text-white">
                          {new Date(req.request_date).toDateString().slice(4, 10)}
                        </div>
                      </div>
                    </li>
                  ))}
            </ul>
          </div>
        </div>

        <form
          method="POST"
          onSubmit={requestMessOff}
          className="bg-secondary py-5 px-10 rounded-lg shadow-custom-black w-full sm:w-auto lg:w-96"
        >
          <div className="flex gap-5">
            <Input field={leavingDate} />
            <Input field={returningDate} />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 text-xl rounded-lg px-5 py-2.5 mt-5 text-center"
          >
            {loading ? (
              <div>{loader} Sending Request...</div>
            ) : (
              "Request Mess Off"
            )}
          </button>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </form>
      </div>
    </div>
  );
}

export default Mess;
