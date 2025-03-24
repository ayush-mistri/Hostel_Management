import mongoose from "mongoose";

const messSchema = new mongoose.Schema({
    date: { type: String, required: true },
    meal: { type: String, required: true },
    time: { type: String, required: true },
    image: { type: String } 
});

const MessDetails = mongoose.model("MessDetails", messSchema);

export default MessDetails;
