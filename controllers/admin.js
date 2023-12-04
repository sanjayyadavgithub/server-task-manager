import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { createError } from "../error.js";
import Task from "../models/Tasks.js";
dotenv.config();
export const EmployeeRegister = async (req, res, next) => {
  try {
    const {
      email,
      password,
      username,
      contact_number,
      department,
      joining_date
    } = req.body;
    const { id } = req.user;
    if (!email) {
      return next(createError(422, "Missing email."));
    }
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }
    const admin = await User.findById(id).exec();
    if (!admin) {
      return next(createError(404, "Admin not found"));
    }
    if (admin.role !== "admin") {
      return next(createError(403, "You are not an admin"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "employee",
      contact_number,
      department,
      joining_date
    });
    const createdUser = await user.save();
    admin.employees.push(createdUser._id);
    await admin.save();
    res.status(200).json({ employee: createdUser });
  } catch (error) {
    return next(error);
  }
};

export const getAllEmployee = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).populate({
      path: "employees",
      select: "-password"
    });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    if (user.role !== "admin") {
      return next(createError(401, "You are not authorized to view this page"));
    }
    return res.status(200).json({
      message: "Employees fetched successfully",
      employees: user.employees
    });
  } catch (err) {
    return next(createError(err.statusCode, err.message));
  }
};

export const getEmployee = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { employeeId } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    if (user.role !== "admin") {
      return next(createError(401, "You are not authorized to view this page"));
    }
    const employee = await User.findById(employeeId)
      .select("-password")
      .populate("tasks")
      .exec();
    if (!employee) {
      return next(createError(404, "Employee not found"));
    }
    return res.status(200).json({
      message: "Employee fetched successfully",
      employee
    });
  } catch (err) {
    return next(createError(err.statusCode, err.message));
  }
};

export const createNewTaskAdmin = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.body.id);
    const {task_description,task_type,start_time,time_taken} = req.body
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const newTask = new Task({
      task_description,
      task_type,
      start_time,
      time_taken
    });
    const savedTask = await newTask.save();
    user.tasks.push(savedTask._id);
    const savedUser = await user.save();
    return res.status(200).json({
      message: "Task created successfully",
      user: savedUser
    });
  } catch (err) {
    return next(createError(err.statusCode, err.message));
  }
};

export const updateExist = async (req,res,next) => {
    try {
      const {id} = req.body;
      const user = await User.findByIdAndUpdate(req.body.id,{active:req.body.active});
      if(!user){
        return next(createError(404, "User not found"));
      }
      return res.status(200).json({
        message: "User Update successfully",
        user: user
      });
    } catch (error) {
      return next(createError(err.statusCode, err.message));
    }

}