import express  from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./db/conn.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import {v2  as cloudinary} from "cloudinary"



dotenv.config()
connectDB()
const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())



cloudinary.config({
    cloud_name:process.env.CLOUDNARY_CLOUD_NAME,
    api_key:process.env.CLOUDNARY_API_KEY,
    api_secret:process.env.CLOUDNARY_API_SECRET
})

app.use(express.json({
    limit:52428800
}))
app.use(express.urlencoded({extended:true,
limit:52428800}))
app.use(cookieParser())

app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)

app.listen(PORT,() => {
    console.log(`servidor rodando na porta ${PORT}`)
})
