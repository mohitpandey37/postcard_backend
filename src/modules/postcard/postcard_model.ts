import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const userModel = require("../users/user_model");

const postcardSchema = new mongoose.Schema({
    recipient: {
        type: String,
        required: true
    },
    street_1: {
        type: String
    },
    street_2: {
        type: String
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipcode: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    created_by:{
        type: ObjectId,
        ref: userModel,
        required: true
    }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

module.exports = mongoose.model('postcards', postcardSchema)