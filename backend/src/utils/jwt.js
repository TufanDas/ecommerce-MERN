import jwt from "jsonwebtoken";
import crypto from "crypto";

import env from "../config/env.js";

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
            type: "access",
        },
        env.jwt.accessSecret,
        {
            expiresIn: env.jwt.accessExpiresIn,
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            type: "refresh",
        },
        env.jwt.refreshSecret,
        {
            expiresIn: env.jwt.refreshExpiresIn,
        }
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        env.jwt.accessSecret
    );
};

const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        env.jwt.refreshSecret
    );
};


// Hash refresh token before storing it in DB
const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};


export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    hashToken,
};