import mongoose from "mongoose";



const connectDb = async () => {
    const Db_Name = "Stationary-Management";
    const MONGO_URI = process.env.MONGO_URI;

    await mongoose.connect(`${MONGO_URI}/${Db_Name}`).then((e)=>{
        console.log("database connection established",e.connection.name)

    })


}

export default connectDb;