import mongoose from 'mongoose'

const ConnectDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI!}/showsphere`);
        console.log("Connected to database successfully");
    }
    catch (error : any) {
        console.error("Error connecting to database");
        return;
    }
}

export default ConnectDb;