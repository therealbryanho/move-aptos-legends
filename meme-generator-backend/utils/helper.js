const JWT = require("jsonwebtoken");
const crypto = require('crypto');

const getAccessToken = (user_id, username, role) => {
    return JWT.sign(
        { user_id, username, role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME }
    )
}

const getRefreshToken = (user_id, username, role) => {
    return JWT.sign(
        { user_id, username, role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME }
    )
}

const generatePasswordResetToken = (length, chars) => {
    let code = "";
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};


const generateEmailVerificationCode = () => {
    // Generate a random 16-byte buffer
    const buffer = crypto.randomBytes(16);

    // Convert the buffer to a hexadecimal string
    const hexCode = buffer.toString('hex');

    // Encode the string to make it URL-safe
    const urlSafeCode = encodeURIComponent(hexCode);

    return urlSafeCode;
}

function extractPowersFromString(powersString) {
    // Define the regular expression pattern
    let pattern = /AP:\s*(\d+)\s*\|\s*DP:\s*(\d+)/i;

    // Execute the regular expression pattern on the input string
    let match = pattern.exec(powersString);

    // Initialize variables for AP and DP
    let ap = undefined;
    let dp = undefined;

    // Check if the match is not null
    if (match) {
        // Extract AP and DP from the matched groups and convert to numbers
        ap = parseInt(match[1], 10);
        dp = parseInt(match[2], 10);
    }

    return { ap, dp };
}

module.exports = {
    extractPowersFromString,
    getAccessToken,
    getRefreshToken,
    generatePasswordResetToken,
    generateEmailVerificationCode,
}
