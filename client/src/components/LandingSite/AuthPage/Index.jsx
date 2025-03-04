import { Outlet } from "react-router-dom";

export default function AuthPage() {
  return (
    <>
      <section className="bg-primary">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-[78vh] lg:py-0">
          <a
            href="/"
            className="flex items-center mb-6 space-x-3 text-2xl font-semibold text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 sm:w-12 sm:h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
              />
            </svg>

            {/* Centered Text */}
            <span className="text-lg font-semibold sm:text-2xl text-center">
              Hostel Management System
            </span>
          </a>
          <Outlet />
        </div>
      </section>
    </>
  );
}
