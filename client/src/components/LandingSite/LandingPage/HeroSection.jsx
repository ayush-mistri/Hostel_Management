import { HeroSVG } from "./HeroSVG";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <main className="flex flex-col-reverse lg:flex-row justify-center items-center text-white text-center px-6 lg:px-20 md:pt-10">
      {/* Text & Buttons */}
      <div className="w-full max-w-2xl md:pt-10">
        <h1 className="font-bold text-4xl md:text-4xl lg:text-5xl">
          Hostel <span className="text-blue-500">Management</span> System
        </h1>
        <p className="py-6 text-lg md:text-xl">
          One Solution For All Of The Hostel&apos;s Needs
        </p>
        <div className="py-10">
          <Link
            to="/auth/login"
            className="bg-blue-500 py-3 px-16 md:px-24 lg:px-40 hover:bg-blue-700 transition rounded text-xl md:text-2xl"
          >
            Login
          </Link>
          <p className="mt-6 mb-3">OR</p>
          <Link
            to="/auth/request"
            className="text-lg md:text-xl hover:underline hover:text-blue-500"
          >
            Request Registration
          </Link>
        </div>
      </div>
      {/* SVG Illustration */}
      <div className="w-full max-w-xs md:max-w-md lg:max-w-lg animate-pulse">
        <HeroSVG />
      </div>
    </main>
  );
}

export { HeroSection };
