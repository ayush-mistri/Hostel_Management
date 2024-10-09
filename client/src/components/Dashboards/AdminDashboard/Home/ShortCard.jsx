import PropTypes from "prop-types";

ShortCard.propTypes = {
  title: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
};

// change the bg color from --> bg-neutral-950
function ShortCard({ number, title }) {
  return (
    <div className="py-5 w-full text-white flex flex-col bg-secondary gap-4 items-center rounded-xl shadow-custom-black md:max-w-[330px]">
      <div className="text-4xl font-bold text-blue-500">{number}</div>
      <div className="text-lg">{title}</div>
    </div>
  );
}

export { ShortCard };
