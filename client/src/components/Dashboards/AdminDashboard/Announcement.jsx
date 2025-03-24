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
    const admin = JSON.parse(localStorage.getItem("admin")); // Assuming admin data is in localStorage

    if (!admin) {
      toast.error("You must be logged in as an admin to create an announcement.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      return;
    }

    try {
      const response = await fetch("https://hostel-management-ofhb.vercel.app/api/announcement/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: admin._id, // Send admin's ID in the request body
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

        // Optionally clear the form after success
        setTitle("");
        setDesc("");
      } else {
        toast.error(data.message || "Announcement creation failed!", {
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
    <div className="w-full min-h-screen flex flex-col gap-8 items-center justify-center px-4 sm:px-6 lg:px-8 overflow-y-auto">
  <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl mt-5 text-center">
    Create Announcement
  </h1>
  
  <form
    method="POST"
    onSubmit={registerAnnouncement}
    className="w-full max-w-lg py-6 px-6 sm:px-10 bg-secondary rounded-lg shadow-custom-black flex flex-col gap-5"
  >
    <Input field={suggestionTitle} />
    
    <div>
      <label
        htmlFor="description"
        className="block mb-2 text-sm font-medium text-white"
      >
        Announcement Description
      </label>
      
      <textarea
        name="description"
        placeholder="Description..."
        className="border sm:text-sm rounded-lg w-full p-3 bg-highlight border-secondary placeholder-black text-white focus:ring-2 focus:ring-black outline-none"
        onChange={descChange}
        value={desc}
        rows="4"
      ></textarea>
    </div>

    <button
      type="submit"
      className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 text-lg rounded-lg px-5 py-2.5"
    >
      Submit Announcement
    </button>
  </form>

  <ToastContainer position="top-right" autoClose={3000} theme="dark" />
</div>

  );
}

export default Announcement;
