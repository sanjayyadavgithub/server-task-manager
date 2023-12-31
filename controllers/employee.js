import dotenv from "dotenv";
import User from "../models/User.js";
import Task from "../models/Tasks.js";
import { createError } from "../error.js";
dotenv.config();
export const createNewTask = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const newTask = new Task(req.body);
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

export const updateTask = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    if (!user.tasks.includes(req.body._id)) {
      return next(createError(404, "You can't update"));
    }
    const task = await Task.findByIdAndUpdate(req.body._id, req.body, {
      new: true
    }).exec();
    return res.status(200).json({
      message: "Task updated successfully",
      task
    });
  } catch (err) {
    return next(createError(err.statusCode, err.message));
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.query;
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    if (!user.tasks.includes(taskId)) {
      return next(createError(404, "You can't delete"));
    }
    user.tasks.pop(taskId);
    await user.save();
    await Task.findByIdAndDelete(req.body._id).exec();
    return res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (err) {
    return next(createError(err.statusCode, err.message));
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).populate("tasks");
    if (!user) {
      return next(createError(404, "User not found"));
    }
    if (user.role !== "employee") {
      return next(createError(401, "You are not authorized to view this page"));
    }
    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks: user.tasks
    });
  } catch (err) {
    return next(createError(err.statusCode, err.message));
  }
};


