const express = require("express");
const { authController, forgotPassword, resetPassword } = require("../controllers/usersController.js");
const { getUserProfile } = require("../controllers/usersController.js");
const { registerUser } = require("../controllers/usersController.js");
const { updateUserProfile } = require("../controllers/usersController.js");

const router = express.Router();

//user registration
router.post('/register', registerUser);

//post email and password auth
router.post('/login', authController);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:id/:token', resetPassword);

//get user profile private route
router.put('/profile/:id', updateUserProfile);

module.exports = router;