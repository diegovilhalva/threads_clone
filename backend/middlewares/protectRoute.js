import User from "../models/User.js"
import jwt from "jsonwebtoken"
const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({message:"Você não tem permissão para executar essa tarefa"})
        }
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            const user = await User.findById(decoded.userId).select("-password")
            
            req.user = user
        
            next()
    } catch (error) {
        res.status(500).json({message:"Ocorreu um erro! tente novamente mais tarde"})
        console.log(error)
    }
}

export  default protectRoute;