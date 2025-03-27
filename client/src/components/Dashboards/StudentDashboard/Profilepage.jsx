import { useState, useEffect } from "react";
import { Input } from "../AdminDashboard/Input";
import { useNavigate } from "react-router-dom";

function StudentProfilePage() {
  const navigate = useNavigate();
  const student = JSON.parse(localStorage.getItem("student")); 

  if (!student) {
    navigate("/login");
  }

  const studentId = student?.id;
  const [username, setUsername] = useState(student?.username || "");
  const [email, setEmail] = useState(student?.email || "");
  const [phone, setPhone] = useState(student?.phone || "");
  const [address, setAddress] = useState(student?.address || "");
  const [dateOfBirth, setDateOfBirth] = useState(student?.dateOfBirth || "");
  const [gender, setGender] = useState(student?.gender || "");
  const [guardianName, setGuardianName] = useState(student?.guardianName || "");
  const [guardianContact, setGuardianContact] = useState(student?.guardianContact || "");
  const [emergencyContact, setEmergencyContact] = useState(student?.emergencyContact || "");
  const [academicYear, setAcademicYear] = useState(student?.academicYear || "");
  const [department, setDepartment] = useState(student?.department || "");
  const [profilePic, setProfilePic] = useState(null);
  const defaultImage = "https://images.freeimages.com/365/images/previews/85b/psd-universal-blue-web-user-icon-53242.jpg";
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const savedPic = localStorage.getItem(`profilePic_${studentId}`);
    if (savedPic) {
      setPreview(savedPic);
    }
  }, [studentId]);

  useEffect(() => {
    return () => {
      if (preview && preview !== localStorage.getItem(`profilePic_${studentId}`)) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, studentId]);

  const updateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("gender", gender);
    formData.append("guardianName", guardianName);
    formData.append("guardianContact", guardianContact);
    formData.append("emergencyContact", emergencyContact);
    formData.append("academicYear", academicYear);
    formData.append("department", department);
    if (profilePic) formData.append("profilePic", profilePic);

    let result = await fetch("https://hostel-management-ofhb.vercel.app/api/student/update-profile", {
      method: "POST",
      body: formData,
    });

    result = await result.json();

    if (result.success) {
      alert("Profile Updated Successfully");
      navigate("/student-dashboard");
    } else {
      alert(result.errors[0]?.msg || "Failed to update profile");
    }
  };

  useEffect(() => {
    setPreview(defaultImage);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full min-h-screen pt-10 flex flex-col items-center justify-center px-4">
      <h1 className="text-white font-bold text-4xl md:text-5xl mb-10 text-center pt-10 md:p-0">Student Profile</h1>

      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6">
        <form
          method="POST"
          onSubmit={updateProfile}
          encType="multipart/form-data"
          className="flex-1 bg-secondary p-6 md:p-8 rounded-lg shadow-custom-black overflow-y-auto h-[70vh]"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center w-full md:w-1/4">
              <h2 className="text-white text-lg md:text-xl font-medium mb-3 text-center">Profile Picture</h2>
              <label className="cursor-pointer text-white px-4 py-2 rounded-lg">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-35 h-28 md:w-38 md:h-32 object-cover rounded-full mb-4"
                  />
                ) : (
                  <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-700 rounded-full mb-4 flex items-center justify-center text-white">
                    No Image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input field={{ name: "Username", type: "text", placeholder: "Username", req: true, onChange: (e) => setUsername(e.target.value), value: username }} />
              <Input field={{ name: "Email", type: "email", placeholder: "Email", req: true, onChange: (e) => setEmail(e.target.value), value: email }} />
              <Input field={{ name: "Phone Number", type: "text", placeholder: "Phone Number", req: true, onChange: (e) => setPhone(e.target.value), value: phone }} />
              <Input field={{ name: "Address", type: "text", placeholder: "Address", req: true, onChange: (e) => setAddress(e.target.value), value: address }} />
              <Input field={{ name: "Date of Birth", type: "date", placeholder: "Date of Birth", req: true, onChange: (e) => setDateOfBirth(e.target.value), value: dateOfBirth }} />
              <div className="flex flex-col">
                <label className="text-white text-sm font-medium mb-2">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-2 rounded-md text-white bg-highlight focus:ring-1 focus:ring-blue-500 focus:border-blue-500" required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input field={{ name: "Guardian Name", type: "text", placeholder: "Guardian Name", req: true, onChange: (e) => setGuardianName(e.target.value), value: guardianName }} />
              <Input field={{ name: "Guardian Contact", type: "text", placeholder: "Guardian Contact", req: true, onChange: (e) => setGuardianContact(e.target.value), value: guardianContact }} />
              <Input field={{ name: "Emergency Contact", type: "text", placeholder: "Emergency Contact", req: true, onChange: (e) => setEmergencyContact(e.target.value), value: emergencyContact }} />
              <Input field={{ name: "Academic Year", type: "text", placeholder: "Academic Year", req: true, onChange: (e) => setAcademicYear(e.target.value), value: academicYear }} />
              <Input field={{ name: "Department", type: "text", placeholder: "Department", req: true, onChange: (e) => setDepartment(e.target.value), value: department }} />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full md:w-auto text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mt-6"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentProfilePage;
