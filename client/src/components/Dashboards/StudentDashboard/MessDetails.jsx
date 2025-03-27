import { useState, useEffect } from "react";

function StudentMessDetails() {
    const [messDetails, setMessDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessDetails = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/messdetail");
                const data = await response.json();

                if (response.ok) {
                    setMessDetails(data);
                } else {
                    setError(data.message || "Failed to fetch data");
                }
            } catch (error) {
                console.error("Error fetching mess details:", error);
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchMessDetails();
    }, []);

    if (loading) return <p className="text-white text-center">Loading...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="w-full h-screen flex flex-col items-center justify-start bg-primary p-6 overflow-y-auto pt-20">
            <h1 className="text-white font-bold text-4xl md:text-5xl mb-8 pt-3 text-center w-full">
                Today's Mess Menu
            </h1>
            {/* Table for Mess Details */}
            <div className="w-full max-w-2xl bg-secondary p-4 rounded-lg shadow-custom-black">
                <table className="w-full text-white border-collapse border border-gray-500">
                    <tbody>
                        <tr className="text-center text-lg">
                            <td className="border border-gray-500 p-2">{messDetails.date}</td>
                            <td className="border border-gray-500 p-2">{messDetails.meal}</td>
                            <td className="border border-gray-500 p-2">{messDetails.time}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Image Section */}
            <div className="mt-6">
                {messDetails.image && (
                    <img src={messDetails.image} alt="Mess Meal" className="rounded-lg w-[600px] h-[400px] object-cover border-4 border-gray-500 shadow-lg" />
                )}
            </div>
        </div>
    );
}

export default StudentMessDetails;
