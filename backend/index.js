import express from "express";
import "dotenv/config";
const app = express();
import cookieParser from "cookie-parser";
import connectDB  from "./src/database/db.js";
import userRoutes from "./src/routes/user.route.js"
import itemRoutes from "./src/routes/item.route.js"
// import SupplierRoutes from "./src/routes/supplier.route.js";
import requestRoutes from "./src/routes/request.route.js"


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// User Routes 
app.use("/api/v1/user",userRoutes)

// Item Routes 
app.use("/api/v1/item",itemRoutes)

// request Routes 
app.use("/api/v1/request",requestRoutes)
// Supplier Routes 
// app.use("/api/v1/supplier",SupplierRoutes)

//Database connection
connectDB();


app.listen(process.env.PORT,(req,res)=>{
    console.log(`connection established on port ${process.env.PORT}`)

})

