import "./App.css";
import { Route, Routes } from "react-router-dom";
import About from "./components/LandingSite/About/index";
import Contact from "./components/LandingSite/Contact/index";
import LandingSite from "./components/LandingSite/Index";
import LandingPage from "./components/LandingSite/LandingPage/index";
import Auth from "./components/LandingSite/AuthPage/Index";
import SignIn from "./components/LandingSite/AuthPage/SignIn";
import RequestAcc from "./components/LandingSite/AuthPage/Request";
import AdminSignIn from "./components/LandingSite/AuthPage/AdminSignIn";
import Index from "./components/Dashboards/StudentDashboard/Index";
import Home from "./components/Dashboards/StudentDashboard/Home";
import StudentLeave from "./components/Dashboards/StudentDashboard/Leave";
import MessDetails from "./components/Dashboards/StudentDashboard/MessDetails";
import Attendance from "./components/Dashboards/StudentDashboard/Attendance";
import Invoices from "./components/Dashboards/StudentDashboard/Invoices";
import Suggestions from "./components/Dashboards/StudentDashboard/Suggestions";
import Complaints from "./components/Dashboards/StudentDashboard/Complaints";
import Settings from "./components/Dashboards/StudentDashboard/Settings";
import Announcement from "./components/Dashboards/StudentDashboard/Announcement";
import Profilepage from "./components/Dashboards/StudentDashboard/Profilepage";
import AdminIndex from "./components/Dashboards/AdminDashboard/Index";
import AdminHome from "./components/Dashboards/AdminDashboard/Home/Home";
import RegisterStudent from "./components/Dashboards/AdminDashboard/RegisterStudent";
import AdminAttendance from "./components/Dashboards/AdminDashboard/Attendance";
import AdminComplaints from "./components/Dashboards/AdminDashboard/Complaints";
import AdminInvoices from './components/Dashboards/AdminDashboard/Invoices';
import AdminSuggestions from './components/Dashboards/AdminDashboard/Suggestions';
import AdminSettings from './components/Dashboards/AdminDashboard/Settings';
import AllStudents from "./components/Dashboards/AdminDashboard/AllStudents";
import AdminLeave from "./components/Dashboards/AdminDashboard/AdminLeave";
import AdminMessDetails from "./components/Dashboards/AdminDashboard/MessDetails";
import AdminProfilepage from "./components/Dashboards/AdminDashboard/Profilepage";
import AdminAnnouncement from './components/Dashboards/AdminDashboard/Announcement';
import NotFound from "./components/NotFound"; // Create a NotFound component

function App() {
  return (
    <>
      <Routes>
        {/* Landing Site Routes */}
        <Route path="/" element={<LandingSite />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="auth" element={<Auth />}>
            <Route index element={<SignIn />} />
            <Route path="login" element={<SignIn />} />
            <Route path="request" element={<RequestAcc />} />
            <Route path="admin-login" element={<AdminSignIn />} />
          </Route>
        </Route>

        {/* Student Dashboard Routes */}
        <Route path="/student-dashboard" element={<Index />}>
          <Route index element={<Home />} />
          <Route path="leave" element={<StudentLeave />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="announcement" element={<Announcement />} />
          <Route path="suggestions" element={<Suggestions />} />
          <Route path="invoices" element={<Invoices />} />       
          <Route path="messdetails" element={<MessDetails />} />  
          <Route path="profile" element={<Profilepage />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={<AdminIndex />}>
          <Route index element={<AdminHome />} />
          <Route path='register-student' element={<RegisterStudent />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="invoices" element={<AdminInvoices />} />
          <Route path="suggestions" element={<AdminSuggestions />} />
          <Route path="announcement" element={<AdminAnnouncement />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="all-students" element={<AllStudents />} />
          <Route path="adminmessdetails" element={<AdminMessDetails />} />
          <Route path="profile" element={<AdminProfilepage />} />
          <Route path="leave" element={<AdminLeave />} />
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
