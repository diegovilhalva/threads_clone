import Post from "../models/Post.js"
import User from "../models/User.js"
import { v2 as cloudnary } from "cloudinary"
const getPost = async (req, res) => {
    
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({ error: "Post não encontrado" })
        }

        res.status(200).json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Ocorreu um erro! tente novamente mais tarde" })
    }
}

const getUserPosts = async (req, res) => {
    try {
        const userName = req.params.username
        const user = await User.findOne({userName:userName})
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" })
        }
        const posts = await Post.find({postedBy:user._id}).sort({createdAt:-1})
        res.status(200).json(posts)

    } catch (error) {
        console.log(error)
    }
}

const createPost = async (req, res) => {
    try {
        const { postedBy, text } = req.body
        let { img } = req.body
        if (!postedBy || !text) {
            return res.status(400).json({ error: "Por favor, preencha todos os dados" })
        }

        const user = await User.findById(postedBy)

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" })
        }
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Impossível relizar tarefa" })
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ error: `Texto dever ter menos de ${maxLength} caracateres` })
        }

        if (img) {
            const uploadedResponse = await cloudnary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newPost = new Post({ postedBy, text, img })

        await newPost.save()

        res.status(201).json(newPost)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Ocorreu um erro! tente novamente mais tarde" })
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const deletedPost = await Post.findById(id)
        if (!deletedPost) {
            return res.status(404).json({ error: "Não foi possivel excluir,post não encontrado" })
        }
        if (deletedPost.postedBy.toString() !== req.user._id.toString()) {
            res.status(401).json({ error: "impossível realizar tarefa" })
        }
        if(deletedPost.img){
            const imgId = deletedPost.img.split("/").pop().split(".")[0]
            await cloudnary.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(id)
        res.status(200).json({ message: "Post deletado com suceso", deletedPost })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Ocorreu um erro! tente novamente mais tarde" })
    }
}

const toogleLikes = async (req, res) => {
    try {
        const { id: postId } = req.params
        const userId = req.user._id

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ error: "Post não encotrado" })
        }

        const userLikedPost = post.likes.includes(userId)

        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            res.status(200).json({ message: "deixou de curtir" })
        } else {
            post.likes.push(userId)
            await post.save()
            res.status(200).json({ message: "Curtiu" })
        }
    } catch (error) {
        res.status(500).json({ error: "Ocorreu um erro! tente novamente mais tarde" })
    }
}
const replyThread = async (req, res) => {
    try {
        const { text } = req.body
        const postId = req.params.id
        const userId = req.user._id
        const userProfilePic = req.user.profilePic
        const username = req.user.userName

        if (!text) {
            return res.status(400).json({ message: "Por favor,preencha todos os campos" })
        }

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ message: "post não encontrado" })
        }

        const reply = { userId, text, userProfilePic, username }

        post.replies.push(reply)

        await post.save()

        res.status(200).json(post)
    } catch (error) {

        res.status(500).json({ message: "Ocorreu um erro! tente novamente mais tarde" })
    }
}

const getFeedpost = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" })
        }

        const following = user.following

        const feedPost = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 })

        res.status(200).json(feedPost)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Ocorreu um erro! tente novamente mais tarde" })
    }
}

export { getPost, createPost, deletePost, toogleLikes, replyThread, getFeedpost, getUserPosts }