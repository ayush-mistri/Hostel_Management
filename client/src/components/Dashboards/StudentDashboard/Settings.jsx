import { useState } from "react";
import { Input } from "../../LandingSite/AuthPage/Input";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Settings() {
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [oldPass, setOldPass] = useState('');

  const changePassword = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("student"));
    
    const data = {
      email: user.email,
      password: oldPass,
      newPassword: pass,
    };
    
    let result = await fetch("http://localhost:3000/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    result = await result.json();

    if (result.success) {
      navigate("/student-dashboard");
    } else {
      toast.error(
        result.errors[0].msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const chngPassField = {
    name: "New Password",
    type: "password",
    placeholder: "New Password",
    req: true,
    onChange: (e) => setPass(e.target.value),
  };
  const chngOldPassField = {
    name: "Old Password",
    type: "password",
    placeholder: "Old Password",
    req: true,
    onChange: (e) => setOldPass(e.target.value),
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-white font-bold text-4xl sm:text-5xl mb-10 text-center">Settings</h1>
      <form method="POST" onSubmit={changePassword} className="w-full max-w-lg">
        <div className="w-full flex flex-col justify-between gap-4 bg-secondary p-6 sm:p-8 rounded-lg shadow-custom-black">
          <h2 className="text-2xl sm:text-3xl text-white font-bold mb-5">
            Change Password
          </h2>
          <Input field={chngOldPassField} />
          <Input field={chngPassField} />
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm sm:text-base px-5 py-2.5 mt-5 text-center"
          >
            Change Password
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
        </div>
      </form>
    </div>
  );
}

export default Settings;
