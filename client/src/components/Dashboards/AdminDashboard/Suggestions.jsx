import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "../../Dashboards/Common/Loader";

function Suggestions() {
  const [loader, setLoader] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const getSuggestions = async () => {
    const hostel = JSON.parse(localStorage.getItem("hostel"));
    const response = await fetch("http://localhost:3000/api/suggestion/hostel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hostel: hostel._id }),
    });

    const data = await response.json();
    if (data.success) {
      setSuggestions(
        data.suggestions
          .filter((suggestion) => suggestion.status === "pending")
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by newest first
      );
    } else {
      toast.error("Something failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const updateSuggestion = async (id) => {
    setLoader(true);
    const response = await fetch("http://localhost:3000/api/suggestion/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status: "approved" }),
    });

    const data = await response.json();
    if (data.success) {
      toast.success("Suggestion Approved", {
        position: "top-right",
        autoClose: 3000,
      });
      await getSuggestions();
    } else {
      toast.error("Something failed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setLoader(false);
  };

  const toggleModal = (suggestion = null) => {
    setModalData(suggestion);
    setShowModal((prev) => !prev);
  };

  useEffect(() => {
    getSuggestions();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center p-4 pt-20 overflow-y-auto">
      <h1 className="text-white font-bold text-4xl sm:text-5xl text-center mb-8">Suggestions</h1>

      <div className="bg-secondary h-auto px-6 py-5 rounded-xl shadow-lg w-full max-w-4xl">
        <span className="text-white font-bold text-2xl mb-5 block">All Suggestions</span>

        <div className="overflow-x-auto">
          <table className="w-full h-auto min-w-max border-collapse border text-white border-gray-700 text-center">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 border border-gray-700">Title</th>
                <th className="p-3 border border-gray-700">Description</th>
                <th className="p-3 border border-gray-700">Date</th>
                <th className="p-3 border border-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-300">No Student Suggestions Found</td>
                </tr>
              ) : (
                suggestions.map((suggestion) => (
                  <tr key={suggestion._id} className="hover:bg-highlight transition-all">
                    <td className="p-3 border border-gray-700 truncate">{suggestion.title}</td>
                    <td className="p-3 border border-gray-700 truncate">
                      <button className="text-blue-400 underline hover:text-blue-300" onClick={() => toggleModal(suggestion)}>Read more</button>
                    </td>
                    <td className="p-3 border border-gray-700">{new Date(suggestion.date).toLocaleDateString()}</td>
                    <td className="p-3 border border-gray-700 text-center">
                      <button className="px-3 p-1 bg-green-500 rounded-lg" onClick={() => updateSuggestion(suggestion._id)}>
                        {loader ? <Loader /> : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer />

      {showModal && (
        <Modal closeModal={toggleModal} suggestion={modalData} acknowledgeSuggestion={updateSuggestion} />
      )}
    </div>
  );
}

export default Suggestions;
