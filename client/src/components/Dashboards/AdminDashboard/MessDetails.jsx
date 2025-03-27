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
    const [cameraFacing, setCameraFacing] = useState("user");
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setSelectedDate(localStorage.getItem("selectedDate") || today);
        setSelectedMeal(localStorage.getItem("selectedMeal") || "Breakfast");
        setImage(localStorage.getItem("image") || null);

        const updateTime = () => setCurrentTime(formatTime(new Date()));
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        localStorage.setItem("selectedDate", selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        localStorage.setItem("selectedMeal", selectedMeal);
    }, [selectedMeal]);

    useEffect(() => {
        if (image) {
            localStorage.setItem("image", image);
        } else {
            localStorage.removeItem("image");
        }
    }, [image]);

    const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    };

    const openCamera = async () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: cameraFacing }
            });

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

    useEffect(() => {
<<<<<<< HEAD
<<<<<<< HEAD
    setImage(null); // Ensure no previous image is set on reload
    openCamera(); 

    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };
}, []);
=======
=======
>>>>>>> be66ba466612207f874583eefe275fad9be4be3e
        setImage(null); // Ensure no previous image is set on reload
        openCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);
<<<<<<< HEAD
>>>>>>> be66ba4 (all main changes done)
=======
>>>>>>> be66ba466612207f874583eefe275fad9be4be3e


    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        setImage(canvas.toDataURL("image/jpeg", 0.8));

        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

<<<<<<< HEAD
const switchCamera = async () => {
    setCameraFacing((prev) => (prev === "user" ? "environment" : "user"));
};

useEffect(() => {
    if (isCameraOpen) {
        openCamera();
    }
}, [cameraFacing]);
=======
    const switchCamera = async () => {
        setCameraFacing((prev) => (prev === "user" ? "environment" : "user"));
    };
>>>>>>> be66ba4 (all main changes done)

    useEffect(() => {
        if (isCameraOpen) {
            openCamera();
        }
    }, [cameraFacing]);

    useEffect(() => {
        if (isCameraOpen) {
            openCamera();
        }
    }, [cameraFacing]);


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
        const loadingToast = toast.loading();

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
            toast.dismiss(loadingToast);

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
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} theme="dark" />

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
                            <video ref={videoRef} className="rounded-lg shadow-lg border border-gray-500 w-[650px] h-[400px] object-cover" autoPlay />
                        ) : (
                            <img src={image} alt="Captured" className="rounded-lg w-[650px] h-[400px] object-cover border-4 border-gray-500 shadow-lg" />
                        )}
                    </div>

                    <canvas ref={canvasRef} style={{ display: "none" }} />

                    <div className="flex gap-3 mt-4">
<<<<<<< HEAD
<<<<<<< HEAD
    {isCameraOpen && <button onClick={captureImage} className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Capture Image</button>}
    {image && !isCameraOpen && <button onClick={retakeImage} className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Retake Image</button>}
    {isCameraOpen && <button onClick={switchCamera} className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">Switch Camera</button>}
</div>
=======
=======
>>>>>>> be66ba466612207f874583eefe275fad9be4be3e
                        {isCameraOpen && <button onClick={captureImage} className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Capture Image</button>}
                        {image && !isCameraOpen && <button onClick={retakeImage} className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Retake Image</button>}
                        {isCameraOpen && <button onClick={switchCamera} className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">Switch Camera</button>}
                    </div>
<<<<<<< HEAD
>>>>>>> be66ba4 (all main changes done)
=======
>>>>>>> be66ba466612207f874583eefe275fad9be4be3e

                </div>
            </div>
        </div>
    );
}

export default MessDetails;
