import express from "express";
import "dotenv/config";
const app = express();
import cookieParser from "cookie-parser";
import connectDB  from "./src/database/db.js";
import userRoutes from "./src/routes/user.route.js"
import itemRoutes from "./src/routes/item.route.js"
import SupplierRoutes from "./src/routes/supplier.route.js";
import issuenceRoutes from "./src/routes/issuence.route.js"
import orderRoutes from "./src/routes/order.route.js"
import analyticsRoutes from "./src/routes/analytics.routes.js"
import cors from "cors"


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOptions))


// User Routes 
app.use("/api/v1/user",userRoutes)

// Item Routes 
app.use("/api/v1/item",itemRoutes)

// Supplier Routes 
app.use("/api/v1/supplier",SupplierRoutes)

// Issuence Routes 
app.use("/api/v1/issuence",issuenceRoutes)

// order Routes 
app.use("/api/v1/order",orderRoutes)

// Analytics 
app.use("/api/v1/analytics", analyticsRoutes)

//Database connection
connectDB();


app.listen(process.env.PORT,(req,res)=>{
    console.log(`connection established on port ${process.env.PORT}`)

})

