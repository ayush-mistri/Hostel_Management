import PropTypes from "prop-types";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

ShortCard.propTypes = {
  title: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  path: PropTypes.string, // Add path prop
};

function ShortCard({ number, title, path }) {
  return (
    <Link
      to={path || "#"}
      className="py-5 w-full text-white flex flex-col bg-secondary gap-4 items-center rounded-xl shadow-custom-black md:max-w-[330px] cursor-pointer hover:bg-gray-700"
    >
      {" "}
      {/* Wrap the card in Link */}
      <div className="text-4xl font-bold text-blue-500">{number}</div>
      <div className="text-lg">{title}</div>
    </Link>
  );
}

export { ShortCard };
