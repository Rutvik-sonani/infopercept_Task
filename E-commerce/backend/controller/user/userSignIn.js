const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Please provide email", error: true });
        }
        if (!password) {
            return res.status(400).json({ message: "Please provide password", error: true });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", error: true });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({ message: "Invalid credentials", error: true });
        }

        const tokenData = {
            _id: user._id,
            email: user.email,
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '8h' });

        const tokenOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        };

        res.cookie("token", token, tokenOption)
            .status(200)
            .json({ message: "Login successfully", data: token, success: true });

    } catch (err) {
        res.status(500).json({ message: err.message || "Server error", error: true });
    }
}

module.exports = userSignInController;
