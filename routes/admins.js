/* eslint-disable import/extensions */
import express from "express";
import {
  EmployeeRegister,
  createNewTaskAdmin,
  getAllEmployee,
  getEmployee,
  updateExist
} from "../controllers/admin.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();
router.post("/employeeregister", verifyToken, EmployeeRegister);
router.get("/getAllEmployees", verifyToken, getAllEmployee);
router.get("/getEmployee/:employeeId", verifyToken, getEmployee);
router.post("/createtaskadmin", verifyToken, createNewTaskAdmin);
router.post("/updateexist",verifyToken,updateExist)

export default router;
