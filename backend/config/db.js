const mongoose= require("mongoose");
const dotenv=require("dotenv")
dotenv.config();

const DB_CONNECT = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected!!!".green.bold);
  } catch (err) {
    console.error(err.message.red.bold);
    process.exit(1);
  }
};
module.exports= DB_CONNECT;
