import { Router } from "express";
import { LoginUser,
    getProfileDetails,
    LogoutUser,
    RegisterUser,
    UpdateUser
 } from "../controller/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";

const router= new Router();

router.post('/login',LoginUser)
router.post('/register',RegisterUser)
router.post("/logout",LogoutUser)
router.put("/Update-Profile",isAuthenticated,UpdateUser)
router.get("/profile",isAuthenticated,getProfileDetails)

export default router;