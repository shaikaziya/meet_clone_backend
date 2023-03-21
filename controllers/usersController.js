const asyncHandler = require('express-async-handler');
const User = require('../models/userModel.js');
const { generateToken } = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400).json("Email Already Exists!!");
    }

    const user = await User.create({ firstName, lastName, email, password })
    if (user) {
        res.status(201).json("User created successfully");
    } else {
        res.status(404).json("User cannot be  created");
    }
})

const authController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(401).json("Invalid login credentials");
    }
});

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email })

    if (!user) {
        res.status(400).send("Invalid Email");
        return;
    }

    try {
        const secret = process.env.JWT_KEY + user.password
        const payload = {
            email: user.email,
            id: user._id
        }
        //User exist and now create a one time link valid for 15 minutes
        const token = jwt.sign(payload, secret, { expiresIn: '15m' });
        const link = `https://mern-meet-clone-5458aa.netlify.app/reset-password/${user._id}/${token}`;
        var transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_APP_PASSWORD
            }
        });
        var mailOptions = {
            from: process.env.EMAIL,
            to: `${user.email}`,
            subject: 'Password reset link from Google Meet Clone',
            html: `We have received your request for reset password. Click this link to reset your password.<br>
                  <a href = ${link}>Click Here</a><br>
                  <p>This link is valid for 15 minutes from your request initiation for password recovery.</p>`
        };

        await transporter.sendMail(mailOptions).then((response) => console.log(response)).catch((error) => console.log(error));
        res.status(200).json("Email sent successfully");
    }
    catch (error) {
        res.status(500).json("Something went wrong");
    }
};

const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    //check if this id exist in database
    const user = await User.findById({ _id: id });

    if (!user) {
        res.status(400).send("User not exists!!");
        return;
    }
    const secret = process.env.JWT_KEY + user.password;

    try {
        jwt.verify(token, secret);
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate({ _id: id }, { $set: { password: encryptedPassword } });
        res.send("Password updated");
    }
    catch (error) {
        res.send("Something went wrong");
    }
};

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            encryptedPassword = await bcrypt.hash(req.body.password, salt);
            user.password = encryptedPassword;
        }
        const updateUser = await user.save();
        res.status(200).json({
            _id: user._id,
            firstName: updateUser.firstName,
            lastName: updateUser.lastName,
            email: updateUser.email,
            token: generateToken(updateUser._id)
        })
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

module.exports = { registerUser, authController, forgotPassword, resetPassword, updateUserProfile }