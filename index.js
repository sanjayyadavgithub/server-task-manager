import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admins.js";
import employeeRoutes from "./routes/employee.js";

const app = express();
dotenv.config();
app.use(express.json());
const corsConfig = {
  credentials: true,
  origin: true
};

app.use(cors(corsConfig));
app.use(morgan("tiny"));
const port =  8800;
const connect = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect("mongodb+srv://soloseh824:nlU4J9iNh5hyYUOH@cluster0.bl9ourj.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
      console.log("MongoDB connected Successfully.......");
    })
    .catch((err) => {
      console.log(err);
    });
};
app.use(express.json());
app.get('/',(req,res)=>{
  res.send({msg:'running application successfully..........'})
})
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong....";
  return res.status(status).json({
    success: false,
    status,
    message
  });
});

app.use(express.json());
app.listen(port, () => {
  console.log("Connected on port",port);
  connect();
});
