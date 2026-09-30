import { registerUser, loginUser,refreshAccessToken,logoutUser } from "../services/auth.service.js";
import {findById} from "../repositories/user.repository.js";

// TEMPORARY TEST CONTROLLER
const adminTest = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome Admin",
    });
};


const getCurrentUser = async (req, res, next) => {
    try {

        const user = await findById(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    isEmailVerified:
                        user.isEmailVerified,
                },
            },
        });

    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {
    try {
        const {
            email,
            password,
        } = req.body;

        const result = await loginUser({
            email,
            password,
        });


        // Store refresh token in HttpOnly cookie
        res.cookie(
            "refreshToken",
            result.refreshToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite:
                    process.env.NODE_ENV === "production"
                        ? "none"
                        : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }
        );


        res.status(200).json({
            success: true,
            message: "Login successful",

            data: {
                user: result.user,
                accessToken: result.accessToken,
            },
        });

    } catch (error) {
        next(error);
    }
};


const register = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
        } = req.body;

        const user = await registerUser({
            firstName,
            lastName,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                },
            },
        });

    } catch (error) {
        next(error);
    }
};


const refresh = async (req, res, next) => {
    try {
        const refreshToken =
            req.cookies.refreshToken;

        const result =
            await refreshAccessToken(
                refreshToken
            );


        // Set new refresh token
        res.cookie(
            "refreshToken",
            result.refreshToken,
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV ===
                    "production",

                sameSite:
                    process.env.NODE_ENV ===
                    "production"
                        ? "none"
                        : "lax",

                maxAge:
                    7 *
                    24 *
                    60 *
                    60 *
                    1000,
            }
        );


        res.status(200).json({
            success: true,

            message:
                "Access token refreshed successfully",

            data: {
                user: result.user,
                accessToken:
                    result.accessToken,
            },
        });

    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const refreshToken =
            req.cookies.refreshToken;

        await logoutUser(refreshToken);


        res.clearCookie(
            "refreshToken",
            {
                httpOnly: true,

                secure:
                    process.env.NODE_ENV ===
                    "production",

                sameSite:
                    process.env.NODE_ENV ===
                    "production"
                        ? "none"
                        : "lax",
            }
        );


        res.status(200).json({
            success: true,
            message: "Logout successful",
        });

    } catch (error) {
        next(error);
    }
};


export {
    register,
    login,
    refresh,
    getCurrentUser,
    adminTest,
    logout,
};