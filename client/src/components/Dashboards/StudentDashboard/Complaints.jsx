import { useEffect, useState } from "react";
import { Input } from "../../LandingSite/AuthPage/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Complaints() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("Electric");
  const [customType, setCustomType] = useState("");
  const [regComplaints, setRegComplaints] = useState([]);

  const types = ["Electric", "Furniture", "Cleaning", "Others"];

  const chngType = (e) => {
    setType(e.target.value);
    if (e.target.value !== "Others") {
      setCustomType(""); // Reset custom type if not 'Others'
    }
  };

  const descChange = (e) => setDesc(e.target.value);

  const registerComplaint = async (e) => {
    e.preventDefault();
    setLoading(true);

    let student = JSON.parse(localStorage.getItem("student"));
    const complaint = {
      student: student._id,
      hostel: student.hostel,
      title: title,
      description: desc,
      type: type === "Others" ? customType : type,
      date: new Date().toISOString(), // ✅ Ensure new complaint has a date
    };

    const res = await fetch("http://localhost:3000/api/complaint/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(complaint),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Complaint Registered Successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });

      // ✅ Immediately update the complaint list and sort newest first
      setRegComplaints((prev) => {
        const updatedComplaints = [
          {
            title: complaint.title,
            status: "Pending", // Assuming new complaints start as "Pending"
            date: new Date().toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            rawDate: new Date(), // ✅ Store raw date for sorting
            type: complaint.type,
          },
          ...prev, // Keep previous complaints
        ];

        // ✅ Sort complaints so the newest appears first
        return updatedComplaints.sort((a, b) => b.rawDate - a.rawDate);
      });

      // ✅ Clear input fields
      setTitle("");
      setDesc("");
      setType("Electric");
      setCustomType("");

      // ✅ Fetch latest complaints from database (optional)
      await fetchComplaints();
    } else {
      toast.error(data.errors, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
    setLoading(false);
  };




  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));
    const cmpln = { student: student._id };

    const fetchComplaints = async () => {
      const student = JSON.parse(localStorage.getItem("student"));
      const cmpln = { student: student._id };

      const res = await fetch("http://localhost:3000/api/complaint/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cmpln),
      });

      const data = await res.json();

      // Get current date and last 30 days limit
      const currentDate = new Date();
      const last30Days = new Date();
      last30Days.setDate(currentDate.getDate() - 30);

      // Filter complaints within the last 30 days
      let complaints = data.complaints
        .filter((complaint) => new Date(complaint.date) >= last30Days)
        .map((complaint) => ({
          title: complaint.title,
          status: complaint.status,
          date: new Date(complaint.date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          rawDate: new Date(complaint.date), // ✅ Store raw date for sorting
          type: complaint.type,
        }))
        .sort((a, b) => b.rawDate - a.rawDate); // ✅ Sort newest first

      setRegComplaints(complaints);
    };


    fetchComplaints();
  }, []);


  return (
    <div className="w-full h-screen flex flex-col items-center justify-start bg-primary p-6 overflow-y-auto pt-20">
      <h1 className="text-white font-bold text-5xl mb-8 pt-3">Complaints</h1>
      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl items-start">
        {/* ✅ New Complaint Form */}
        <form
          method="POST"
          onSubmit={registerComplaint}
          className="lg:w-1/2 w-full pt-6 py-5 pb-7 px-10 bg-secondary rounded-lg shadow-custom-black flex flex-col gap-3"
        >
          <div>
            <label
              htmlFor="type"
              className="block mb-2 text-sm font-medium text-white"
            >
              Your complaint type
            </label>
            <select
              className="border sm:text-sm rounded-lg block w-full p-2.5 bg-highlight border-secondary text-white outline-none"
              onChange={chngType}
              value={type}
            >
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            {type === "Others" && (
              <div className="pt-5">
                <Input
                  field={{
                    name: "customType",
                    placeholder: "Enter complaint type",
                    req: true,
                    type: "text",
                    value: customType,
                    onChange: (e) => setCustomType(e.target.value),
                  }}
                />
              </div>
            )}
          </div>
          <Input
            field={{
              name: "title",
              placeholder: "Complaint Title",
              req: true,
              type: "text",
              value: title,
              onChange: (e) => setTitle(e.target.value),
            }}
          />
          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-white"
            >
              Your complaint description
            </label>
            <textarea
              name="description"
              placeholder="Details of complaint"
              className="border sm:text-sm rounded-lg block w-full p-2.5 bg-highlight border-secondary text-white outline-none"
              onChange={descChange}
              value={desc}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 text-lg rounded-lg p-2 mt-2"
            disabled={loading}
          >
            {loading ? "Registering Complaint..." : "Register Complaint"}
          </button>
        </form>

        {/* ✅ Complaints List */}
        <div className="w-full h-auto p-6 border rounded-lg  bg-secondary border-neutral-900 drop-shadow-xl overflow-y-auto">
          <h5 className="text-xl font-bold leading-none text-white mb-5">
            Registered Complaints
          </h5>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-white border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 p-2">Title</th>
                  <th className="border border-gray-700 p-2">Date</th>
                  <th className="border border-gray-700 p-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {regComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center p-2">No complaints registered</td>
                  </tr>
                ) : (
                  regComplaints.map((complain, index) => (
                    <tr key={index}>
                      <td className="border border-gray-700 p-3 px-4 break-words text-center max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[300px]">
                        {complain.title}
                      </td>
                      <td className="border border-gray-700 p-3 px-4 whitespace-nowrap text-center">
                        {complain.date}
                      </td>
                      <td className="border border-gray-700 p-3 px-4 break-words text-center max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-[300px]">
                        {complain.type}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
    </div>
  );
}

export default Complaints;
