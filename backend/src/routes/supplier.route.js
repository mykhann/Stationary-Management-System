import express from "express";
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  deleteSupplier
} from "../controller/supplier.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";

const router = express.Router();

router.post("/create",isAuthenticated, createSupplier);
router.get("/get", getAllSuppliers);
router.get("get/:id", getSupplierById);
router.delete("/:id", deleteSupplier);

export default router;
