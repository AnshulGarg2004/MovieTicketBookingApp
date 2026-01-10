import mongoose from 'mongoose'

const ConnectDb = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            return;
        }
        await mongoose.connect(`${process.env.MONGODB_URI!}/showsphere`);
        console.log("Connected to database successfully");
    }
    catch (error : any) {
        console.error("Error connecting to database:", error.message);
        return;
    }
}

export default ConnectDb;