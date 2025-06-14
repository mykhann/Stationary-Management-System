import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { LoginUser,
    getProfileDetails,
    LogoutUser,
    RegisterUser,
    UpdateUser,
    getUsers
 } from "../controller/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";

const router= new Router();
router.post('/login',LoginUser)
router.post('/get',getUsers)
router.post('/register',upload.single("avatar"),RegisterUser)
router.post("/logout",LogoutUser)
router.put("/Update-Profile",isAuthenticated,UpdateUser)
router.get("/profile",isAuthenticated,getProfileDetails)

export default router;