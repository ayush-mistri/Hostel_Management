import MessDetails from "../models/MessDetails.js";

// Get Mess Details
export const getMessDetails = async (req, res) => {
    try {
        const messDetails = await MessDetails.findOne(); // Always fetch the single existing entry
        if (!messDetails) {
            return res.status(404).json({ message: "No mess details found" });
        }
        res.status(200).json(messDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMessDetails = async (req, res) => {
    try {
        const { date, meal, time, image } = req.body;

        if (!date || !meal || !time || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        console.log("Received Mess Details:", { date, meal, time, image: image.substring(0, 30) + "..." }); // Log image preview

        // Find and update the existing mess details, or insert a new one if it doesn't exist
        const updatedMessDetails = await MessDetails.findOneAndUpdate(
            {}, // Find the first document
            { date, meal, time, image }, // New data
            { new: true, upsert: true } // Create if not found
        );

        res.status(200).json({ message: "Mess details updated successfully!", data: updatedMessDetails });
    } catch (error) {
        console.error("Error updating mess details:", error);
        res.status(500).json({ message: "Server error" });
    }
};


