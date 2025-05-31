import { Router } from "express";
import { getIssuenceLogs } from "../controller/issuenceLogs.controller.js";
const router=new Router();


router.route("/get").get(getIssuenceLogs)


export default router;