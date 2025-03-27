import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "react-top-loading-bar";
import emailjs from "emailjs-com";

function Invoices() {
  const [progress, setProgress] = useState(0);
  const [allInvoices, setAllInvoices] = useState([]);
  const [pendingInvoices, setPendingInvoices] = useState([]);

  // Fetch Invoices
  const getInvoices = async () => {
    setProgress(30);
    let hostel = JSON.parse(localStorage.getItem("hostel"));
    try {
      const res = await fetch("https://hostel-management-ofhb.vercel.app/api/invoice/getbyid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hostel: hostel._id }),
      });
      setProgress(60);
      const data = await res.json();
      console.log(data);
      if (data.success) {
        setAllInvoices(data.invoices);
        console.log(data.invoices)
        setPendingInvoices(
          data.invoices.filter((invoice) => invoice.status === "pending")
        );
      } else {
        toast.error(data.errors, { theme: "dark" });
      }
    } catch (err) {
      toast.error("Error fetching invoices!", { theme: "dark" });
    }
    setProgress(100);
  };

  // Generate Invoices
  const genInvoices = async () => {
    setProgress(30);
    let hostel = JSON.parse(localStorage.getItem("hostel"));
    try {
      const res = await fetch("https://hostel-management-ofhb.vercel.app/api/invoice/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hostel: hostel._id }),
      });
      setProgress(60);
      const data = await res.json();
      if (data.success) {
        toast.success("Invoices generated successfully!", { theme: "dark" });
        getInvoices();
      } else {
        toast.error(data.errors, { theme: "dark" });
      }
    } catch (err) {
      toast.error("Error generating invoices!", { theme: "dark" });
    }
    setProgress(100);
  };

  // Approve Invoice
  const approveInvoice = async (id) => {
    setProgress(30);
    try {
      const res = await fetch("https://hostel-management-ofhb.vercel.app/api/invoice/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student: id, status: "approved" }),
      });
      setProgress(60);
      const data = await res.json();
      if (data.success) {
        toast.success("Invoice approved successfully!", { theme: "dark" });
        getInvoices();
      } else {
        toast.error("Error approving invoice!", { theme: "dark" });
      }
    } catch (err) {
      toast.error("Error approving invoice!", { theme: "dark" });
    }
    setProgress(100);
  };

  // Send Invoice Email
  const sendEmail = (email, amount) => {
    console.log(email)
    emailjs
      .send(
        "service_zd8j699", // Replace with your EmailJS service ID
        "template_8viibje", // Replace with your EmailJS template ID
        { to_email: email, amount: amount },
        "qKgzsdh_j7Y3WDoxz" // Replace with your EmailJS user ID
      )
      .then(() => {
        toast.success("Invoice sent successfully!", { theme: "dark" });
      })
      .catch((err) => {
        console.error("Email sending error:", err);
        toast.error("Failed to send email!", { theme: "dark" });
      });
      console.log("Sending email to:", email);
  };

  useEffect(() => {
    getInvoices();
  }, [allInvoices.length, pendingInvoices.length]);

  return (
    <div className="w-full h-screen flex flex-col gap-3 bg-primary items-center justify-center">
      <LoadingBar color="#0000FF" progress={progress} onLoaderFinished={() => setProgress(0)} />
      <h1 className="text-white font-bold text-5xl">Invoices</h1>
      <button
        onClick={genInvoices}
        className="py-3 px-7 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-800 transition-all shadow-custom-black"
      >
        Generate Invoices
      </button>
      <div className="bg-secondary px-10 py-5 rounded-xl shadow-custom-black sm:w-[50%] sm:min-w-[500px] w-full mt-5 max-h-96 overflow-auto">
        <span className="text-white font-bold text-xl">All Invoices</span>
        <ul role="list" className="divide-y divide-gray-700 text-white">
          {pendingInvoices.length === 0
            ? "No Students Found"
            : pendingInvoices.map((invoice) => (
                <li
                  className="my-2 py-3 px-5 rounded sm:py-2 hover:bg-highlight hover:scale-105 transition-all"
                  key={invoice.id}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">{invoice.student.name}</p>
                      <p className="text-sm truncate text-gray-400">
                        Room: {invoice.student.room_no} | Amount: Rs. {invoice.amount}
                      </p>
                    </div>
                    <button
                      onClick={() => sendEmail(invoice.student.email, invoice.amount)}
                      className="py-1 px-3 rounded bg-green-500 text-white hover:bg-green-700 transition"
                    >
                      Send Email
                    </button>
                    <button
                      onClick={() => approveInvoice(invoice.student._id)}
                      className="py-1 px-3 rounded bg-blue-500 text-white hover:bg-blue-700 transition"
                    >
                      Approve
                    </button>
                  </div>
                </li>
              ))}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Invoices;
