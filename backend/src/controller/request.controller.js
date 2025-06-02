import { asyncHandler } from '../middlewares/asyncHandler.js';
import { Request } from '../model/request.model.js';
import { IssuanceLog } from '../model/Issuence.model.js';
import { sendEmail } from '../middlewares/sendEmail.js';


//  Create a request for a single item

const createRequest = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        res.status(400).json({
            success: false,
            message: "Quantity is required"
        });

    }

    const newRequest = await Request.create({
        userId,
        items: [
            {
                itemId: itemId,
                quantity: quantity
            }
        ]
    });


    res.status(201).json({
        success: true,
        newRequest
    });
});

//   Get all requests (admin)
const getAllRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find()
        .populate('userId', 'UserName email')
        .populate('items.itemId', 'name stock').sort({ createdAt: -1 })

    if (!requests) {
        return res.status(404).json({
            success: false,
            message: "Request not found"
        });
    }

    res.status(200).json({
        success: true,
        requests
    });
});

// Get user request History 
const getUserRequests = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const requests = await Request.find({ userId })
        .populate('items.itemId', 'name stock')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        requests
    });
});

//Update request status (approve/reject)

const updateRequestStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status value
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status value"
        });
    }

    // Find the request by ID
    const request = await Request.findById(id).populate("userId");

    if (!request) {
        return res.status(404).json({
            success: false,
            message: "Request not found"
        });
    }

    // Update request status and review info
    request.status = status;
    request.reviewedAt = new Date();
    request.reviewedBy = req.user._id;

    await request.save();

    // If approved, create issuance logs
    if (status === 'approved') {
        for (const item of request.items) {
            await IssuanceLog.create({
                itemId: item.itemId,
                userId: request.userId,
                quantity: item.quantity,
                issuedBy: req.user._id,
                issuedAt: new Date(),
            });
        }

        if (request.userId.email) {
            await sendEmail({
                to: request.userId.email,
                subject: 'Your Request Has Been Approved',
                text: `Hello ${request.userId.name || ''},\n\nYour request with ID ${request._id} has been approved.\n\nRegards,\nAdmin Team`,
            });
        }
    }
    // If rejected, send rejection email
    else if (status === 'rejected') {
        if (request.userId.email) {
            await sendEmail({
                to: request.userId.email,
                subject: 'Your Request Has Been Rejected',
                text: `Hello ${request.userId.name || ''},\n\nWe regret to inform you that your request with ID ${request._id} has been rejected.\n\nRegards,\nAdmin Team`,
            });
        }
    }

    return res.status(200).json({ success: true, message: `Request ${status}` });
});


const getRequestById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "request Id Missing"
        })
    }
    const request = await Request.findById(id);
    if (!request) {
        return res.status(404).json({
            success: false,
            message: "request not found"
        })
    }
    res.status(200).json({
        success: true,
        request

    })
})


export { createRequest, getAllRequests, getUserRequests, updateRequestStatus, getRequestById }