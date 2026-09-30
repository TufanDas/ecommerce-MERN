import RefreshToken from "../models/refresh-token.model.js";

const createRefreshToken = async (data) => {
    return await RefreshToken.create(data);
};

const findByTokenHash = async (tokenHash) => {
    return await RefreshToken.findOne({
        tokenHash,
    });
};

const revokeToken = async (tokenHash) => {
    return await RefreshToken.findOneAndUpdate(
        {
            tokenHash,
            revokedAt: null,
        },
        {
            revokedAt: new Date(),
        },
        {
            new: true,
        }
    );
};

const revokeAllUserTokens = async (userId) => {
    return await RefreshToken.updateMany(
        {
            user: userId,
            revokedAt: null,
        },
        {
            revokedAt: new Date(),
        }
    );
};

export {
    createRefreshToken,
    findByTokenHash,
    revokeToken,
    revokeAllUserTokens,
};