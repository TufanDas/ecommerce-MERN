import User from "../models/user.model.js";

const createUser = async (userData) => {
    return await User.create(userData);
};

const findByEmail = async (email) => {
    return await User.findOne({ email });
};

const findById = async (id) => {
    return await User.findById(id);
};

export {
    createUser,
    findByEmail,
    findById,
};