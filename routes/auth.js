import express from "express";
import {
  AdminRegister,
  AdminLogin,
  EmployeeLogin,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
  findUserByEmail,
  UpdatePassword,
  UpdateProfile,
  getAllTaskAdmin
} from "../controllers/auth.js";
import { localVariables } from "../middleware/verifyEmail.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
router.post("/admin/register", localVariables, AdminRegister);//done
router.post("/admin/login", AdminLogin);//done
router.get("/admin/generateotp", localVariables, generateOTP);
router.get("/admin/verifyotp", verifyOTP);
router.get("/admin/createResetSession", createResetSession);
router.put("/admin/forgetpassword", resetPassword);
router.post("/employee/login", EmployeeLogin);
router.get("/admin/findbyemail", findUserByEmail);
router.put("/updatepassword", verifyToken, UpdatePassword);
router.put("/updateprofile", verifyToken, UpdateProfile);
router.get("/admin/alltask",verifyToken,getAllTaskAdmin)

export default router;
