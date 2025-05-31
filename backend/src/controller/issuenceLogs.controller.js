import { IssuanceLog } from "../model/Issuence.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const getIssuenceLogs=asyncHandler(async(req,res)=>{
    const logs= await IssuanceLog.find();
    if (!logs){
        res.status(400).json({
            success:false,
            logs
        })
    }

})

export{getIssuenceLogs}