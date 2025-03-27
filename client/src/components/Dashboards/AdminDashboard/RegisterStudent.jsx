import { useState } from "react";
import { Input } from "./Input";
import { Button } from "../Common/PrimaryButton";
import { Loader } from "../Common/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegisterStudent() {
  const registerStudent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let student = {
        name,
        cms_id: cms,
        room_no,
        batch,
        dept,
        course,
        email,
        father_name: fatherName,
        contact,
        address,
        dob,
        cnic,
        hostel,
        password,
      };
      const res = await fetch("http://localhost:3000/api/student/register-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Student ${data.student.name} Registered Successfully!`, {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        setCms(""); setName(""); setRoomNo(""); setBatch(""); setDept(""); setCourse("");
        setEmail(""); setFatherName(""); setContact(""); setAddress(""); setDob(""); setCnic(""); setPassword("");
      } else {
        data.errors.forEach((err) => {
          toast.error(err.msg, { position: "top-right", autoClose: 3000 });
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred. Please try again.", { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const hostel = JSON.parse(localStorage.getItem("hostel")).name;
  const [cms, setCms] = useState("");
  const [name, setName] = useState("");
  const [room_no, setRoomNo] = useState("");
  const [batch, setBatch] = useState("");
  const [dept, setDept] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full h-screen pt-20 flex flex-col bg-primary items-center px-5 overflow-y-auto">
      <h1 className="text-white font-bold text-4xl md:text-5xl mt-8 mb-8 text-center">Register Student</h1>
      <div className="w-full max-w-4xl p-6 md:p-10 bg-secondary rounded-lg shadow-custom-black mb-10">
        <form onSubmit={registerStudent}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input field={{ name: "name", placeholder: "Student Name", type: "text", req: true, value: name, onChange: (e) => setName(e.target.value) }} />
            <Input field={{ name: "cms", placeholder: "Student CMS", type: "number", req: true, value: cms, onChange: (e) => setCms(e.target.value) }} />
            <Input field={{ name: "dob", placeholder: "Student DOB", type: "date", req: true, value: dob, onChange: (e) => setDob(e.target.value) }} />
            <Input field={{ name: "Aadhar number", placeholder: "Student Aadhar number", type: "text", req: true, value: cnic, onChange: (e) => setCnic(e.target.value) }} />
            <Input field={{ name: "email", placeholder: "Student Email", type: "email", req: true, value: email, onChange: (e) => setEmail(e.target.value) }} />
            <Input field={{ name: "contact", placeholder: "Student Contact", type: "text", req: true, value: contact, onChange: (e) => setContact(e.target.value) }} />
            <Input field={{ name: "father name", placeholder: "Father's Name", type: "text", req: true, value: fatherName, onChange: (e) => setFatherName(e.target.value) }} />
          </div>

          <div className="col-span-2 pt-2">
            <label htmlFor="address" className="block mb-2 text-sm font-medium text-white">Address</label>
            <textarea name="address" placeholder="Student Address" required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2.5 bg-highlight border border-secondary rounded-lg text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-2" />
          </div>

          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input field={{ name: "college", placeholder: "College", type: "text", req: true, value: dept, onChange: (e) => setDept(e.target.value) }} />
            <Input field={{ name: "department", placeholder: "Department", type: "text", req: true, value: course, onChange: (e) => setCourse(e.target.value) }} />
            <Input field={{ name: "batch", placeholder: "Batch", type: "number", req: true, value: batch, onChange: (e) => setBatch(e.target.value) }} />
            <Input field={{ name: "room", placeholder: "Room Number", type: "number", req: true, value: room_no, onChange: (e) => setRoomNo(e.target.value) }} />
            <Input field={{ name: "hostel", placeholder: "Hostel", type: "text", req: true, value: hostel, disabled: true }} />
            <Input field={{ name: "password", placeholder: "Password", type: "password", req: true, value: password, onChange: (e) => setPassword(e.target.value) }} />
          </div>
          <div className="col-span-2 mt-5">
            <Button>{loading ? <><Loader /> Registering...</> : <span>Register Student</span>}</Button>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
          </div>
        </form>
      </div>
    </div>

  );
}

export default RegisterStudent;
