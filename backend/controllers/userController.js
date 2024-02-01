import User from "../models/User.js"
import Post from "../models/Post.js"
import bcrypt, { hash } from "bcrypt"
import generateToken from "../utils/helpers/generateToken.js"
import {v2 as cloudinary} from "cloudinary"
import mongoose from "mongoose"
const signupUser =  async (req,res) => {
    try {
            const {name,email,userName,password} = req.body
           
            const  user = await User.findOne({$or:[{email},{userName}]})
            if(user){
                return res.status(400).json({error:"Usuário já existe"})
            }
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password,salt)

            const newUser = new User({name,email,userName,password:hashPassword})

            await newUser.save()

            if(newUser){
                generateToken(newUser._id,res)
               return res.status(201).json({message:"Usuário criado com sucesso!",
               _id:newUser._id,
               name: newUser.name,
               email: newUser.email,
               userName: newUser.userName,
               bio:newUser.bio,
               profilePic:newUser.profilePic
            })
            }else {
                return res.status(400).json({error:"Usuário inválido"})
            }

    } catch (error) {
        res.status(500).json({error:"Por favor, preencha todos os dados!"})
        console.log(error)
    }    
}

const login = async (req,res) => {
    try {
        const {userName,password} = req.body
        const user = await User.findOne({userName})
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "") 
        
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error:"Usuário ou senha incorreta"})
        }
        
        generateToken(user._id,res)

        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            userName:user.userName,
            bio:user.bio,
            profilePic:user.profilePic
        })
    } catch (error) {
        res.status(500).json({error:"Ocorreu um erro! tente novamente mais tarde"})
        console.log(error)
    }
}

const logout = (req,res) => {
    try {
        res.cookie("jwt","",{maxAge:1})
        res.status(200).json({message:"Logout feito com sucesso!"})
    } catch (error) {
        res.status(500).json({error:"Ocorreu um erro! tente novamente mais tarde"})
        console.log(error)
    }
}

const getProfile = async (req,res) => {
    const {query} = req.params
    // query is either userName or userId
    try {
       let user;
       if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({_id:query}).select("-password").select("-updatedAt")
       }else{
           user = await User.findOne({userName:query}).select("-password").select("-updatedAt")
       }
        if (!user) {
            return res.status(404).json({error:"Usuário não encontrado"})
        }

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({error:"Ocorreu um erro! tente novamente mais tarde"})
    }
}

const followUser = async (req,res) => {
    try {
        const {id} = req.params
        const userTomodify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)
        if (id === req.user._id.toString()) {
            return res.status(400).json({error:"Você não pode seguir a si mesmo"})
        }

        if (!userTomodify || !currentUser) {
            return res.status(404).json({error:"Usuário não encontrado"})
        }
      
        const isFollowing = currentUser.following.includes(id)

        if (isFollowing) {            
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "Deixou de seguir" });

        }else{
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });   
            res.status(200).json({ message: "Seguindo" });
        }
    } catch (error) {
        res.status(500).json({error:"Ocorreu um erro! tente novamente mais tarde"})
        console.log(error)
    }

    
}
const updateUser = async (req,res) => {
    const {name,email,userName,password,bio} = req.body
    let {profilePic} = req.body
    const userId = req.user._id  
    try {
        
        let user = await User.findById(userId)
        if(!user) return res.status(404).json({message:"Usuário não encontrado"})
        if(req.params.id !== userId.toString()){
            return res.status(400).json({message:"Impossível realizar tarefa"})
        }
        if (password) {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password,salt)
            user.password = hashPassword
        }

        if (profilePic) {
            if(user.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
            }
            
            const uploadedResponse = await cloudinary.uploader.upload(profilePic)
            profilePic = uploadedResponse.secure_url
        }
        user.name = name || user.name
        user.email = email || user.email
        user.userName = userName || user.userName
        user.profilePic = profilePic || user.profilePic
        user.bio = bio || user.bio

        user = await user.save()
        await Post.updateMany({"replies.userId":userId},
        {
            $set:{
                "replies.$[reply].username":user.userName,
                "replies.$[reply].userProfilePic":user.profilePic
            }
        },
        {arrayFilters:[{"reply.userId":userId}]}
        )
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({message:"Ocorreu um erro! tente novamente mais tarde"})
    }
}


export {signupUser,login,logout,followUser,updateUser,getProfile}