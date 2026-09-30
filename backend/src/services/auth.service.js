import {
    createUser,
    findByEmail,
    findById,
} from "../repositories/user.repository.js";

import {
    createRefreshToken,
    findByTokenHash,
    revokeToken,
} from "../repositories/refresh-token.repository.js";

import {
    generateAccessToken,
    generateRefreshToken,
    hashToken,
    verifyRefreshToken,
} from "../utils/jwt.js";

import {
    comparePassword,
    hashPassword,
} from "../utils/password.js";



const registerUser = async ({
    firstName,
    lastName,
    email,
    password,
}) => {

    // Check whether user already exists
    const existingUser = await findByEmail(email);

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    // Hash password before saving
    const hashedPassword = await hashPassword(password);

    // Public registration always creates END_USER
    const user = await createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    return user;
};



const loginUser = async ({
    email,
    password,
}) => {

    const user = await findByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
        throw new Error("Your account has been deactivated");
    }

    const passwordMatched = await comparePassword(
        password,
        user.password
    );

    if (!passwordMatched) {
        throw new Error("Invalid email or password");
    }


    // Generate tokens
    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    const tokenHash = hashToken(refreshToken);


    // Calculate refresh-token expiry
    const expiresAt = new Date();

    expiresAt.setDate(
        expiresAt.getDate() + 7
    );


    // Store hashed refresh token
    await createRefreshToken({
        tokenHash,
        user: user._id,
        expiresAt,
    });


    // Update login time
    user.lastLoginAt = new Date();

    await user.save();


    return {
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },

        accessToken,

        refreshToken,
    };
};



const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }

    let payload;

    try {
        payload = verifyRefreshToken(refreshToken);
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }

    if (payload.type !== "refresh") {
        throw new Error("Invalid refresh token");
    }

    const tokenHash = hashToken(refreshToken);

    const storedToken = await findByTokenHash(tokenHash);

    if (!storedToken) {
        throw new Error("Refresh token not found");
    }

    if (storedToken.revokedAt) {
        throw new Error("Refresh token has been revoked");
    }

    if (storedToken.expiresAt < new Date()) {
        throw new Error("Refresh token has expired");
    }


    const user = await findById(payload.sub);

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.isActive) {
        throw new Error("User account is inactive");
    }


    // Revoke old refresh token
    await revokeToken(tokenHash);


    // Generate new tokens
    const accessToken = generateAccessToken(user);

    const newRefreshToken =
        generateRefreshToken(user);

    const newTokenHash =
        hashToken(newRefreshToken);


    // New refresh token expiry
    const expiresAt = new Date();

    expiresAt.setDate(
        expiresAt.getDate() + 7
    );


    // Store new refresh token
    await createRefreshToken({
        tokenHash: newTokenHash,
        user: user._id,
        expiresAt,
    });


    return {
        accessToken,

        refreshToken: newRefreshToken,

        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
    };
};




const logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        return;
    }

    const tokenHash = hashToken(refreshToken);

    await revokeToken(tokenHash);
};


export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
};