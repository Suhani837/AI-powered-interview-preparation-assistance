const express = require("express");
const authRouter = express.Router()
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")

/**
 * @route POST /api.auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register",authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */

authRouter.post("/login",authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie
 * @access Public
 */

authRouter.get("/logout",authController.logoutUserController)

/**
 * @router GET /api/auth/get-me
 * @description get the current logged in user details
 * @access Private
 */

authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)

module.exports=authRouter