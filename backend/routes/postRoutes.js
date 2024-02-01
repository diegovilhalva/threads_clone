import express from "express"
import {createPost, deletePost, getFeedpost, getPost, getUserPosts, replyThread, toogleLikes} from "../controllers/postController.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()
router.get("/feed",protectRoute,getFeedpost)
router.get("/:id",getPost)
router.get("/user/:username",getUserPosts)
router.post("/create",protectRoute,createPost)
router.delete("/:id",protectRoute,deletePost)
router.put("/like/:id",protectRoute,toogleLikes)
router.put("/reply/:id",protectRoute,replyThread)
export default  router;