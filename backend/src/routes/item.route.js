import express from 'express';
import {upload} from "../middlewares/multer.middleware.js"
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getLatestArrivals
} from '../controller/item.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js';

const router = express.Router();

router.post('/create',isAuthenticated, upload.single("avatar"), createItem);
router.get('/get', getAllItems);
router.get("/latestArrivals",getLatestArrivals)
router.get('/:id', getItemById);
router.put('/update/:id',isAuthenticated,upload.single("image"), updateItem);
router.delete('/delete/:id', deleteItem);

export default router;
