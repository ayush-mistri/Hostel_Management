import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "../../LandingSite/AuthPage/Input";

function Announcement() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const titleChange = (e) => setTitle(e.target.value);
  const descChange = (e) => setDesc(e.target.value);

  const registerAnnouncement = async (e) => {
    e.preventDefault();
    const student = JSON.parse(localStorage.getItem("student"));

    try {
      const response = await fetch("http://localhost:3000/api/announcements/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: student._id,
          title,
          description: desc,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Announcement created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });

        // Optionally clear form after success
        setTitle("");
        setDesc("");
      } else {
        toast.error("Announcement creation failed!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      }
    } catch (error) {
      toast.error("Server error, please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    }
  };

  const suggestionTitle = {
    name: "Announcement title",
    placeholder: "Title",
    req: true,
    type: "text",
    value: title,
    onChange: titleChange,
  };

  return (
    <div className="w-full h-screen flex flex-col gap-10 items-center justify-center max-h-screen overflow-y-auto">
      <h1 className="text-white font-bold text-5xl mt-5">Announcement</h1>
      <form
        method="POST"
        onSubmit={registerAnnouncement}
        className="md:w-[30vw] w-full py-5 pb-7 px-10 bg-secondary rounded-lg shadow-custom-black flex flex-col gap-5"
      >
        <Input field={suggestionTitle} />
        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-white"
          >
            Announcement description
          </label>
          <textarea
            name="description"
            placeholder="Description..."
            className="border sm:text-sm rounded-lg block w-full p-2.5 bg-highlight border-secondary placeholder-black text-white focus:ring-black focus:border-black outline-none"
            onChange={descChange}
            value={desc}
          ></textarea>
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 text-lg rounded-lg px-5 py-2.5 mt-5 text-center"
          >
            Submit Announcement
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>

  );
}

export default Announcement;
