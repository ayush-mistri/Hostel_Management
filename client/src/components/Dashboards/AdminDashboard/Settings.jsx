import { useState } from "react";
import { Input } from "./Input";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const changePassword = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("admin"));

    const data = {
      email: user.email,
      password: oldPass,
      newPassword: pass,
    };

    let result = await fetch("https://hostel-management-ofhb.vercel.app/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    result = await result.json();

    if (result.success) {
      alert("Password Changed Successfully");
      navigate("/admin-dashboard");
    } else {
      alert(result.errors[0].msg);
    }
  };


  const [pass, setPass] = useState("");
  const [oldPass, setOldPass] = useState('');
  const chngPassField = {
    name: "New Password",
    type: "password",
    placeholder: "New Password",
    req: true,
    onChange: chngPass,
    value: pass,
  };
  const chngOldPassField = {
    name: "Old Password",
    type: "password",
    placeholder: "Old Password",
    req: true,
    onChange: chngOldPass,
    value: oldPass,
  };

  function chngPass(e) {
    setPass(e.target.value);
  }

  function chngOldPass(e) {
    setOldPass(e.target.value);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <h1 className="text-white font-bold text-4xl sm:text-5xl mb-8 text-center">
        Settings
      </h1>
      <form method="POST" onSubmit={changePassword} className="w-full max-w-md">
        <div className="flex flex-col gap-4 bg-secondary p-6 sm:p-8 rounded-lg shadow-custom-black">
          <h2 className="text-2xl sm:text-3xl text-white font-bold mb-4 sm:mb-5">
            Change Password
          </h2>
          <Input field={chngOldPassField} />
          <Input field={chngPassField} />
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>

  );
}

export default Settings;
