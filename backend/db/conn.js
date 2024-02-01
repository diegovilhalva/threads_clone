import mongoose from "mongoose";

const  connectDB  = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
    }
}

export default connectDB;