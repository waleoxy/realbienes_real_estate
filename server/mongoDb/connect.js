import mongoose from "mongoose";

const connectDB = async (url) => {
    mongoose.set('strictQuery', true)

    mongoose.connect(url)
    .then(()=>console.log("MongoDB connected"))
    .catch((error)=> console.log(error))
}

export default connectDB