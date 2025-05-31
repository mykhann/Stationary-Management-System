import { IssuanceLog } from "../model/Issuence.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const getIssuenceLogs = asyncHandler(async (req, res) => {
    const logs = await IssuanceLog.find().populate(
        [
            { path: "issuedBy", select: "name" },
            { path: "userId", select: "name email phone" }
        ]
    );
    if (!logs) {
        return res.status(400).json({
            success: false,
            message: "Not found"
        });
    };
    res.status(200).json({
        success: true,
        logs
    })

});

const getIssuenceLogsById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Provide Id"
        })
    }

    const logs = await IssuanceLog.findById(id).populate(
        [
            { path: "issuedBy", select: "name email" },
            { path: "userId", select: "name email" }
        ]
    );
    if (!logs) {
        return res.status(404).json({
            success: false,
            message: "No logs found"
        })
    }
    res.status(200).json({
        success: true,
        logs
    });

});

const deleteLog=asyncHandler(async(req,res)=>{
    const {id}= req.params;
    if (!id){
        return res.status(400).json({
            success:false,
            message:"Please enter log Id"
        })
    }
    const log= await IssuanceLog.findByIdAndUpdate(id);
    if (!log){
        return res.status(404).json({
            success:false,
            message:"Issuence Log not found"
        })
    }
    res.status(200).json({
        success:true,
        message:"Log deleted successfully"
    })

});



export { getIssuenceLogs, getIssuenceLogsById ,deleteLog}