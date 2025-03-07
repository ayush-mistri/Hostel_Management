import { useState, useEffect } from "react";
import { getAllStudents } from "../../../utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AllStudents() {
  const [allStudents, setAllStudents] = useState([]);
  const [roomGroups, setRoomGroups] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const roomsPerPage = 9;

  const getAll = async () => {
    const data = await getAllStudents();
    setAllStudents(data.students);

    const rooms = {};
    data.students.forEach((student) => {
      if (!rooms[student.room_no]) {
        rooms[student.room_no] = [];
      }
      rooms[student.room_no].push(student);
    });
    setRoomGroups(rooms);
  };

  const openRoomModal = (roomNo) => {
    setSelectedRoom(roomNo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const nextPage = () => {
    if ((currentPage + 1) * roomsPerPage < Object.keys(roomGroups).length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const deleteStudent = async (id) => {
    const res = await fetch(
      "https://hostel-management-ofhb.vercel.app/api/student/delete-student",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    const data = await res.json();
    if (data.success) {
      // Remove the deleted student from the allStudents state
      setAllStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== id)
      );
      // Remove the deleted student from roomGroups as well
      setRoomGroups((prevRoomGroups) => {
        const updatedRooms = { ...prevRoomGroups };
        const roomNo = allStudents.find(
          (student) => student._id === id
        )?.room_no;
        if (roomNo && updatedRooms[roomNo]) {
          updatedRooms[roomNo] = updatedRooms[roomNo].filter(
            (student) => student._id !== id
          );
          if (updatedRooms[roomNo].length === 0) {
            delete updatedRooms[roomNo]; // Optional: remove the room if no students are left
          }
        }
        return updatedRooms;
      });

      toast.success("Student Deleted Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error(data.errors[0].msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col gap-6 items-center justify-center">
      <h1 className="text-white font-bold text-5xl">All Students</h1>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.keys(roomGroups)
          .slice(currentPage * roomsPerPage, (currentPage + 1) * roomsPerPage)
          .map((roomNo) => {
            const studentCount = roomGroups[roomNo].length;
            const studentCountClass =
              studentCount >= 3 ? "text-red-500" : "text-green-500";
            const studentMessage =
              studentCount >= 3
                ? `Room is full`
                : `Number of Students : ${studentCount}`;

            return (
              <div
                key={roomNo}
                onClick={() => openRoomModal(roomNo)}
                className="w-72 h-24 flex flex-col items-center justify-center bg-secondary text-white font-bold text-2xl rounded-lg shadow-custom-black cursor-pointer transition-all transform hover:scale-105 mb-3"
              >
                <span>Room {roomNo}</span>
                <span
                  className={`text-lg ${studentCountClass} font-semibold italic text-sm`}
                >
                  {studentMessage}
                </span>
              </div>
            );
          })}
      </div>

      {/* Pagination Buttons (Stick to Bottom) */}
      <div className="flex items-center gap-5 w-full justify-center fixed bottom-0 py-12">
        <button
          className={`py-2 px-4 rounded ${
            currentPage === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-800 text-white"
          }`}
          onClick={prevPage}
          disabled={currentPage === 0}
        >
          Previous
        </button>

        <span className="text-white font-bold">
          Page {currentPage + 1} of{" "}
          {Math.ceil(Object.keys(roomGroups).length / roomsPerPage)}
        </span>

        <button
          className={`py-2 px-4 rounded ${
            (currentPage + 1) * roomsPerPage >= Object.keys(roomGroups).length
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-800 text-white"
          }`}
          onClick={nextPage}
          disabled={
            (currentPage + 1) * roomsPerPage >= Object.keys(roomGroups).length
          }
        >
          Next
        </button>
      </div>

      {isModalOpen && selectedRoom && (
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
              Room {selectedRoom}
            </h2>

            <ul role="list" className="divide-y divide-gray-700 text-white">
              {roomGroups[selectedRoom] &&
              roomGroups[selectedRoom].length === 0 ? (
                <li className="py-3 text-center">No Students Found</li>
              ) : (
                roomGroups[selectedRoom]?.map((student) => (
                  <li
                    className="my-2 py-3 px-5 rounded sm:py-2 hover:bg-highlight hover:scale-105 transition-all"
                    key={student._id}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-white">
                          {student.name}
                        </p>
                        <p className="text-sm truncate text-gray-400">
                          {student.cms_id} | Room: {student.room_no}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button className="hover:underline hover:text-green-600 hover:scale-125 transition-all">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </button>
                        <button
                          className="hover:underline hover:text-red-500 hover:scale-125 transition-all"
                          onClick={() => deleteStudent(student._id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-5.32 0A2.102 2.102 0 007.5 4.438v.917m7.5 0a48.288 48.288 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllStudents;
