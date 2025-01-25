import { PropTypes } from "prop-types";

Modal.propTypes = {
  closeModal: PropTypes.func,
  suggestion: PropTypes.object,
  acknowledgeSuggestion: PropTypes.func, // Add this prop
};

function Modal({ closeModal, suggestion, acknowledgeSuggestion }) {
  const ack = () => {
    acknowledgeSuggestion(suggestion._id);  // Acknowledge the suggestion
    closeModal();  // Close the modal after acknowledgment
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100%] max-h-full flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full max-w-2xl max-h-full lg:translate-x-[17%]">
        <div className="rounded-lg bg-secondary p-5">
          {/* Modal header */}
          <div className="flex items-start justify-between p-4 border-b rounded-t border-highlight">
            <h3 className="text-xl font-semibold text-white">{suggestion.title}</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-highlight hover:text-white"
              onClick={() => closeModal()}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="p-6 space-y-6">
            <p className="text-base leading-relaxed text-gray-400">{suggestion.description}</p>
          </div>
          {/* Modal footer */}
          <div className="flex items-center p-6 space-x-2 border-t rounded-b border-highlight">
            <button
              className="text-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-800"
              onClick={() => ack()}
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Modal };

