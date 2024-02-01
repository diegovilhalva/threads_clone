import express from "express";

const router = express.Router()

import {followUser, getProfile, login, logout, signupUser, updateUser} from "../controllers/userController.js"
import protectRoute from "../middlewares/protectRoute.js";

router.get("/profile/:query",getProfile)
router.post("/signup",signupUser)
router.post("/login",login)
router.post("/logout",logout)
router.post("/follow/:id",protectRoute,followUser)
router.patch("/update/:id",protectRoute,updateUser)
export default router;
