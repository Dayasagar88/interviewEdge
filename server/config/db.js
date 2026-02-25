import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB connected!🥳")
    } catch (error) {
        console.log(`Error connecting database!😥 ${error}`)
    }
}

export default connectDB