let jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

// Generar token
const generateToken = (user) => {
    const token = jwt.sign(
        { id: user._id || user.id, email: user.email, username: user.username },
        secretKey,
        { expiresIn: '1h' }
    );
    return token;
};

module.exports = {
    generateToken
}

