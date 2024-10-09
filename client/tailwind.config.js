/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/App.css", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A1A", // Charcoal
        secondary: "#2C2C2C", // Light Charcoal
        highlight: "#4F4F4F", // Medium Gray
      },
      boxShadow: {
        'custom-black': '0 15px 10px rgba(0, 0, 0, 0.6)', // A soft shadow with black
    },
    },
  },
  plugins: [],
};

// primary: '#0D0D0D',   // Jet Black
// secondary: '#1A1A1A', // Charcoal
// highlight: '#333333', // Slate Gray
