import mongoose from "mongoose";
import { USER_ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
        },

        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.END_USER,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        lastLoginAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;