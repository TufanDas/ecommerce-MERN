import dotenv from "dotenv";

dotenv.config();

const env = {
    port: process.env.PORT || 5000,

    nodeEnv: process.env.NODE_ENV || "development",

    mongoUri: process.env.MONGODB_URI,

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },

    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

export default env;