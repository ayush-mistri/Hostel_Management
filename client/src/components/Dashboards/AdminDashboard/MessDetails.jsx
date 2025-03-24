import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MessDetails() {
    const [selectedDate, setSelectedDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [selectedMeal, setSelectedMeal] = useState("Breakfast");
    const [image, setImage] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setSelectedDate(today);
        const updateTime = () => setCurrentTime(formatTime(new Date()));
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    };

    const openCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setIsCameraOpen(true);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
            }
        } catch (error) {
            toast.error("Error accessing camera.");
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            canvas.width = videoRef.current.videoWidth || 640;
            canvas.height = videoRef.current.videoHeight || 480;
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            setImage(canvas.toDataURL("image/png"));

            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                setStream(null);
            }
            setIsCameraOpen(false);
        }
    };

    const retakeImage = () => {
        setImage(null);
        openCamera();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!selectedDate || !selectedMeal || !image) {
            toast.error("Please fill all fields and capture an image!");
            return;
        }
    
        setIsLoading(true);
        const loadingToast = toast.loading("Submitting...", {
            style: { 
                color: "green", // Green text
                border: "2px solid green" // Green border
            }
        });        
    
        const formData = {
            date: selectedDate,
            meal: selectedMeal,
            time: currentTime,
            image: image
        };
    
        try {
            const response = await fetch("https://hostel-management-ofhb.vercel.app/api/messdetail/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
    
            const data = await response.json();
            toast.dismiss(loadingToast); // Remove "Submitting..." toast
    
            if (response.ok) {
                toast.success("Data submitted successfully!");
            } else {
                toast.error("Error: " + data.message);
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Failed to submit data.");
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="w-full h-screen flex flex-col items-center justify-start bg-primary p-6 overflow-y-auto pt-20">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />

            <h1 className="text-white font-bold text-5xl mb-8 pt-3">Mess Details</h1>

            <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl items-start">
                <form onSubmit={handleSubmit} className="lg:w-1/2 w-full pt-6 py-5 pb-7 px-10 bg-secondary rounded-lg shadow-custom-black flex flex-col gap-3">
                    <div>
                        <label className="block text-sm md:text-lg mb-1 text-white">Select Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm md:text-lg text-white mb-1">Select Meal</label>
                        <select
                            value={selectedMeal}
                            onChange={(e) => setSelectedMeal(e.target.value)}
                            className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        >
                            <option value="Breakfast">🍳 Breakfast</option>
                            <option value="Lunch">🍛 Lunch</option>
                            <option value="Dinner">🍽️ Dinner</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm md:text-lg text-white mb-1">Current Time</label>
                        <div className="p-1.5 rounded bg-gray-700 text-white border border-gray-600 w-full text-center text-sm md:text-lg">
                            ⏰ {currentTime}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-5 py-2 mt-4 text-white rounded-lg transition text-sm md:text-lg ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {isLoading ? "Submitting..." : "Submit"}
                    </button>
                </form>

                <div className="w-full h-[500px] p-6 border rounded-lg bg-secondary border-neutral-900 drop-shadow-xl overflow-hidden flex flex-col items-center justify-center">
                    <div className="relative w-full flex justify-center">
                        {!image ? (
                            <video ref={videoRef} className="rounded-lg shadow-lg border border-gray-500 w-[600px] h-[380px] object-cover" autoPlay />
                        ) : (
                            <img src={image} alt="Captured" className="rounded-lg w-[600px] h-[380px] object-cover border-4 border-gray-500 shadow-lg" />
                        )}
                    </div>

                    <canvas ref={canvasRef} style={{ display: "none" }} />

                    <div className="flex gap-3 mt-4">
                        {!isCameraOpen && !image && (
                            <button onClick={openCamera} className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm md:text-lg">
                                Open Camera
                            </button>
                        )}
                        {isCameraOpen && !image && (
                            <button onClick={captureImage} className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm md:text-lg">
                                Capture Image
                            </button>
                        )}
                        {image && (
                            <button onClick={retakeImage} className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm md:text-lg">
                                Retake Image
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                theme="dark"
            />
        </div>
    );
}

export default MessDetails;