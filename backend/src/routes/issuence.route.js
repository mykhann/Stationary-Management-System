import { Router } from "express";
import { deleteLog, getIssuenceLogs, getIssuenceLogsById } from "../controller/issuenceLogs.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
const router=new Router();

// Get all issuence logs (Admin)
router.route("/get").get(isAuthenticated,  getIssuenceLogs)

// get issuenceLogs by Id (Admin)
router.route("/:id").get(isAuthenticated,getIssuenceLogsById)

// delete Log (Admin)
router.route("/:id/delete").delete(deleteLog)




export default router;