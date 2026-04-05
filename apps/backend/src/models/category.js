
import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    usedCount: {
        type: Number,
        default: 0,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Category", categorySchema);