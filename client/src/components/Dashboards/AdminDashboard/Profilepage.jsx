import { useState } from "react";
import { Input } from "./Input";
import { useNavigate } from "react-router-dom";

function Profilepage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin")); // Assuming the user details are saved in localStorage

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePic, setProfilePic] = useState(null);

  const updateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (profilePic) formData.append("profilePic", profilePic);

    let result = await fetch("http://localhost:3000/api/user/update-profile", {
      method: "POST",
      body: formData, // Send formData including image
    });

    result = await result.json();

    if (result.success) {
      alert("Profile Updated Successfully");
      navigate("/admin-dashboard");
    } else {
      alert(result.errors[0].msg);
    }
  };

  const handleImageChange = (e) => {
    setProfilePic(e.target.files[0]); // Get the uploaded file
  };

  const usernameField = {
    name: "Username",
    type: "text",
    placeholder: "Username",
    req: true,
    onChange: (e) => setUsername(e.target.value),
    value: username,
  };

  const emailField = {
    name: "Email",
    type: "email",
    placeholder: "Email",
    req: true,
    onChange: (e) => setEmail(e.target.value),
    value: email,
  };

  return (
    <div className="w-full h-screen flex pt-10 flex-col items-center justify-center">
  <h1 className="text-white font-bold text-5xl mb-8 text-center">Profile</h1>
  <form 
    method="POST" 
    onSubmit={updateProfile} 
    encType="multipart/form-data" 
    className="w-full flex justify-center"
  >
    <div className="w-full lg:w-3/4 xl:w-2/3 h-[70vh] flex flex-col justify-between gap-6 bg-secondary p-12 rounded-lg shadow-custom-black overflow-y-auto">
      <h2 className="text-4xl text-white font-bold mb-6">Update Profile</h2>
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex-1">
          <Input field={usernameField} />
          <Input field={emailField} />
        </div>
        <div className="flex flex-col items-center lg:w-1/2 gap-6">
          <label className="text-white text-lg font-medium mb-2">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-white file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {profilePic && (
            <img
              src={URL.createObjectURL(profilePic)} // Show uploaded image
              alt="Profile"
              className="w-48 h-48 rounded-full object-cover border-2 border-white shadow-lg"
            />
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-lg px-6 py-3 mt-5 text-center"
      >
        Update Profile
      </button>
    </div>
  </form>
</div>

  );
}

export default Profilepage;
