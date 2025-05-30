import express from 'express';
import {upload} from "../middlewares/multer.middleware.js"
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem
} from '../controller/item.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware.js';

const router = express.Router();

router.post('/create',isAuthenticated, upload.single("image"), createItem);
router.get('/get', getAllItems);
router.get('/:id', getItemById);
router.put('/update/:id', updateItem);
router.delete('/delete/:id', deleteItem);

export default router;
