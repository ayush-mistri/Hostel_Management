import { useEffect, useState } from "react";
import jsPDF from "jspdf";

function Attendance() {
  const [daysOff, setDaysOff] = useState(0);
  const [thisWeek, setThisWeek] = useState([]);
  const [absentDays, setAbsentDays] = useState([]);

  let totalDays = new Date().getDate();

  const getAttendance = async () => {
    let student = JSON.parse(localStorage.getItem("student"));
    const res = await fetch("http://localhost:3000/api/attendance/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ student: student._id }),
    });
    const data = await res.json();
    if (data.success) {
      let daysOff = 0;
      let thisWeek = [];
      let absentDates = [];
      let attendanceMap = new Map();

      // Store fetched attendance data in a map
      data.attendance.forEach((day) => {
        let formattedDate = new Date(day.date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        attendanceMap.set(formattedDate, day.status);
        if (day.status === "absent") {
          daysOff++;
          absentDates.push(formattedDate);
        }
      });

      // Check for missing days and assign "Not Taken"
      for (let i = 6; i >= 0; i--) {
        let currentDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        let formattedDate = currentDate.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        let weekday = currentDate.toLocaleDateString("en-PK", {
          weekday: "long",
        });

        let status = attendanceMap.get(formattedDate) || "NT"; // Default to "Not Taken" if not found

        thisWeek.push({
          weekdate: formattedDate,
          weekday: weekday,
          status: status,
        });
      }

      setDaysOff(daysOff);
      setThisWeek(thisWeek);
      setAbsentDays(absentDates);
    } else {
      console.log("Error");
    }
  };

  useEffect(() => {
    getAttendance();
  }, []);

  // Function to generate PDF for absent days
  const generateAbsentDaysPDF = () => {
    if (absentDays.length === 0) {
      alert("No absent days found!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("List of Absent Days", 20, 20);

    absentDays.forEach((date, index) => {
      doc.text(`${index + 1}. ${date}`, 20, 40 + index * 10);
    });

    doc.save("AbsentDays.pdf");
  };

  return (
    <div className="w-full h-screen flex flex-col items-center p-4 pt-20 overflow-y-auto">
      <h1 className="text-white font-bold text-4xl sm:text-5xl mb-5">Attendance</h1>

      {/* Total Summary Table */}
      <div className="w-full h-auto max-w-4xl bg-secondary p-5 rounded-lg shadow-lg text-white mb-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse border border-gray-700 text-center">
            <thead>
              <tr className="bg-gray-800 text-lg">
                <th className="border border-gray-700 p-3">Total Days</th>
                <th className="border border-gray-700 p-3">Present Days</th>
                <th className="border border-gray-700 p-3">Absent Days</th>
                <th className="border border-gray-700 p-3">Download</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-900 text-lg">
                <td className="border border-gray-700 p-3">{totalDays}</td>
                <td className="border border-gray-700 p-3">{totalDays - daysOff}</td>
                <td className="border border-gray-700 p-3">{daysOff}</td>
                <td className="border border-gray-700 p-3">
                  <button
                    onClick={generateAbsentDaysPDF}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Attendance Table */}
      <div className="w-full h-auto max-w-4xl bg-secondary p-5 rounded-lg shadow-lg text-white">
        <h2 className="text-xl font-bold mb-3">This Week</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse border border-gray-700 text-center">
            <thead>
              <tr className="bg-gray-800 text-lg">
                <th className="border border-gray-700 p-3">Weekday</th>
                <th className="border border-gray-700 p-3">Date</th>
                <th className="border border-gray-700 p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {thisWeek.map((day) => (
                <tr key={day.weekdate} className="bg-gray-900 text-lg">
                  <td className="border border-gray-700 p-3">{day.weekday}</td>
                  <td className="border border-gray-700 p-3">{day.weekdate}</td>
                  <td
                    className={`border border-gray-700 p-3 font-semibold ${day.status === "present"
                        ? "text-green-400"
                        : day.status === "absent"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                  >
                    {day.status === "present" ? "Present" : day.status === "absent" ? "Absent" : "NT"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
