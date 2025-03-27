import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "react-top-loading-bar";
import { getAllStudents } from "../../../utils";

function Attendance() {
  const [progress, setProgress] = useState(0);
  const [unmarkedStudents, setUnmarkedStudents] = useState([]);
  const [markedStudents, setMarkedStudents] = useState([]);
  const [groupedByRoom, setGroupedByRoom] = useState({});
  const [openRoom, setOpenRoom] = useState(null); // Track the currently selected room
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  const [present, setPresent] = useState(0);

  // New states for pagination
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  // const [currentPage, setCurrentPage] = useState(0);
  const roomsPerPage = 9; // Number of rooms to show per page

  const getALL = async () => {
    setProgress(30);
    const markedResponse = await fetch(
      "https://hostel-management-ofhb.vercel.app/api/attendance/getHostelAttendance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hostel: JSON.parse(localStorage.getItem("hostel"))._id,
        }),
      }
    );

    const markedData = await markedResponse.json();
    setProgress(50);

    if (markedData.success) {
      const markedStudentsData = markedData.attendance.map((student) => ({
        id: student.student._id,
        cms: student.student.cms_id,
        name: student.student.name,
        room: student.student.room_no,
        attendance: student.status === "present",
      }));
      setMarkedStudents(markedStudentsData);
      setProgress(70);

      const data = await getAllStudents();
      const allStudents = data.students;

      const unmarkedStudentsData = allStudents
        .filter(
          (student) =>
            !markedStudentsData.find(
              (markedStudent) => markedStudent.id === student._id
            )
        )
        .map((student) => ({
          id: student._id,
          cms: student.cms_id,
          name: student.name,
          room: student.room_no,
          attendance: undefined,
        }));

      setUnmarkedStudents(unmarkedStudentsData);
      setProgress(90);
      setGroupedByRoom(
        groupStudentsByRoom(markedStudentsData.concat(unmarkedStudentsData))
      );
      setProgress(100);
    }
  };

  const groupStudentsByRoom = (students) => {
    return students.reduce((acc, student) => {
      if (!acc[student.room]) {
        acc[student.room] = [];
      }
      acc[student.room].push(student);
      return acc;
    }, {});
  };

  const markAttendance = async (id, isPresent) => {
    const response = await fetch(`https://hostel-management-ofhb.vercel.app/api/attendance/mark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student: id,
        status: isPresent ? "present" : "absent",
      }),
    });

    const data = await response.json();
    if (data.success) {
      toast.success("Attendance Marked Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });

      const updatedUnmarkedStudents = unmarkedStudents.filter(
        (student) => student.id !== id
      );
      const updatedMarkedStudents = [
        ...markedStudents,
        { id, attendance: isPresent },
      ];

      const updatedGroupedByRoom = { ...groupedByRoom };
      for (const room in updatedGroupedByRoom) {
        updatedGroupedByRoom[room] = updatedGroupedByRoom[room].filter(
          (student) => student.id !== id
        );
      }

      setUnmarkedStudents(updatedUnmarkedStudents);
      setMarkedStudents(updatedMarkedStudents);
      setGroupedByRoom(updatedGroupedByRoom); // Update the room structure
    }
  };

  useEffect(() => {
    getALL();
  }, []);

  useEffect(() => {
    setPresent(markedStudents.filter((student) => student.attendance).length);
  }, [markedStudents]);

  const date = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const RoomCard = ({ roomNumber, students }) => {
    // Check if all students in the room are marked
    const allMarked = students.every(
      (student) => student.attendance !== undefined
    );
    const attendancecolor = allMarked ? "text-green-500" : "text-red-500";

    return (
      <div
        className="w-72 h-24 flex flex-col items-center justify-center bg-secondary text-white font-bold text-2xl rounded-lg shadow-custom-black cursor-pointer transition-all transform hover:scale-105 mb-3"
        onClick={() => openModal(roomNumber)}
      >
        <span>Room {roomNumber}</span>

        <span
          className={`text-lg ${attendancecolor} font-semibold italic text-sm`}
        >
          {allMarked ? "All marked" : "Remain"}
        </span>
      </div>
    );
  };

  const Modal = ({ roomNumber, students, closeModal }) => {
    const unmarkedStudents = students.filter(
      (student) => student.attendance === undefined
    );

    return (
      <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100%] max-h-full flex items-center justify-center bg-black bg-opacity-75">
        <div className="relative w-full max-w-2xl max-h-full lg:translate-x-[17%] rounded-lg shadow bg-secondary p-7">
          <svg
            onClick={closeModal}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-gray-400 absolute top-4 right-4 cursor-pointer rounded-lg inline-flex items-center hover:bg-highlight hover:text-white mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>

          <h2 className="text-lg font-bold mb-4 text-white">
            Students in Room {roomNumber}
          </h2>
          {unmarkedStudents.length > 0 ? (
            <ul className="text-white divide-y divide-gray-500">
              {unmarkedStudents.map((student) => (
                <li
                  key={student.id}
                  className="flex justify-between items-center py-3"
                >
                  <div className="flex-1">
                    <p className="text-white">{student.name}</p>
                    <p className="text-sm text-gray-300">CMS: {student.cms}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => markAttendance(student.id, false)}
                      className="py-1 px-4 bg-red-500 text-white rounded hover:bg-red-700"
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => markAttendance(student.id, true)}
                      className="py-1 px-4 bg-blue-600 text-white rounded hover:bg-blue-800"
                    >
                      Present
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white text-center">
              All students have been marked.
            </p>
          )}
        </div>
      </div>
    );
  };

  const openModal = (roomNumber) => {
    setOpenRoom(roomNumber);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOpenRoom(null);
  };

  const areAllStudentsMarked = (students) => {
    return students.every((student) => student.attendance !== undefined);
  };

  const roomKeys = Object.keys(groupedByRoom);
  const totalRooms = roomKeys.length;
  const totalPages = Math.ceil(totalRooms / roomsPerPage);
  const startIndex = currentRoomIndex * roomsPerPage; // Calculate start index for the current page
  const endIndex = Math.min(startIndex + roomsPerPage, totalRooms); // Ensure we don't exceed total rooms
  const currentRooms = roomKeys.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentRoomIndex > 0) {
      setCurrentRoomIndex(currentRoomIndex - 1); // Move to the previous page
    }
  };

  // Function to handle the next page
  const handleNext = () => {
    if ((currentRoomIndex + 1) * roomsPerPage < totalRooms) {
      setCurrentRoomIndex(currentRoomIndex + 1); // Move to the next page
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center p-4 pt-20 overflow-y-auto xl:justify-center">
      <LoadingBar
        color="#0000FF"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <h1 className="text-white font-bold text-5xl mb-3">Attendance</h1>
      <p className="text-white text-xl mb-8">Date: {date}</p>

      {/* Room Cards & Pagination Wrapper */}
      <div className="flex flex-col items-center w-full">
        {/* Room Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentRooms.map((roomNumber) => {
            const students = groupedByRoom[roomNumber]; // Get students for the current room
            return (
              <RoomCard
                key={roomNumber} // Unique key for each room card
                roomNumber={roomNumber}
                students={students}
              />
            );
          })}
        </div>

        {/* Next/Previous Buttons */}
        <div className="flex items-center gap-5 w-full justify-center py-6 md:py-8">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            className={`py-2 px-4 rounded ${currentRoomIndex === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-800 text-white"
              }`}
            disabled={currentRoomIndex === 0} // Disable if on the first page
          >
            Previous
          </button>

          {/* Page Number Display */}
          <span className="text-white font-bold">
            Page {currentRoomIndex + 1} of {totalPages}
          </span>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className={`py-2 px-4 rounded ${(currentRoomIndex + 1) * roomsPerPage >= totalRooms
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-800 text-white"
              }`}
            disabled={(currentRoomIndex + 1) * roomsPerPage >= totalRooms} // Disable if on the last page
          >
            Next
          </button>
        </div>
      </div>

      <ToastContainer />

      {isModalOpen && openRoom && (
        <Modal
          roomNumber={openRoom}
          students={groupedByRoom[openRoom]}
          closeModal={closeModal}
        />
      )}
    </div>

  );
}

export default Attendance;
