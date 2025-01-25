// import PropTypes from 'prop-types';

// ShortCard.propTypes = {
//   student: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     cms: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     room: PropTypes.string.isRequired,
//   }).isRequired,
//   markAttendance: PropTypes.func.isRequired,
// };

// function ShortCard({ student, markAttendance }) {
//   return (
//     <li className="my-2 py-3 sm:py-2 px-5 rounded hover:bg-highlight hover:scale-105 transition-all">
//       <div className="flex items-center space-x-4">
//         <div className="flex-shrink-0 text-white">
//           {/* Replace with your student avatar or icon */}
//           <span className="w-6 h-6 rounded-full bg-gray-600"></span>
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-medium truncate text-white">{student.name}</p>
//           <p className="text-sm truncate text-gray-400">{student.cms} | Room: {student.room}</p>
//         </div>
//         <button
//           className="hover:underline hover:text-green-600 hover:scale-125 transition-all"
//           onClick={() => markAttendance(student.id, true)}
//         >
//           Mark Present
//         </button>
//         <button
//           className="hover:underline hover:text-red-600 hover:scale-125 transition-all"
//           onClick={() => markAttendance(student.id, false)}
//         >
//           Mark Absent
//         </button>
//       </div>
//     </li>
//   );
// }

// export default ShortCard;
