import express from "express";
import "dotenv/config";
const app = express();
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js"
import connectDB  from "./database/db.js";

app.use(express.json());
// app.use(urlencoded());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// User Routes 
app.use("/api/v1/user",userRoutes)

//Database connection
connectDB();


app.listen(process.env.PORT,(req,res)=>{
    console.log(`connection established on port ${process.env.PORT}`)

})

