import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_CONNECT=async()=>{
    try{
    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        useUnifiedTopology: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Database connected!!!".green.bold);
    }
    catch(err){
        console.error(err.message.red.bold);
        process.exit(1);
    }
}
export default DB_CONNECT;