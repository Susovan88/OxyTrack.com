import express from "express";
import cors from "cors";
import env from "dotenv";
import http from 'http';
import { socketManager } from "./controllers/socketManager.js";
import main from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/addminRoute.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js"
import {scheduleReminders} from "./schedules/reminderScheduler.js"
import { AQIconfig } from "./config/AQI.js";
import AQIrouter from "./routes/aqiRoute.js";
import Analyzerouter from "./routes/analyseRoute.js";
import generateRouter from "./routes/generateRoute.js";


env.config();
const app=express();
const server=http.createServer(app);
const io=socketManager(server);
const port=process.env.PORT;

//middlewares
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "utoken" , "atoken" , "dtoken"],
    credentials: true,
  })
);   // it is allow to connect frontend to backend

app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 

main().then(()=>{  // connect mongodb
    console.log("-> -> mongodb is connected with server!!!")
}).catch(err=> console.log("err: ",err));

connectCloudinary(); // connect cloudinary

// scheduleReminders();    // sechedule reminder for user. it will be update more in future using socket.io

app.use('/api/user',userRouter);

app.use('/api/admin',adminRouter);

app.use("/api/doctor",doctorRouter);

app.use('/api/aqi', AQIrouter);

app.use('/api/analyze', Analyzerouter);

app.use('/api/generate', generateRouter);

app.get("/" ,(req,res)=>{
    res.send("Hello world");
});


server.listen(port,()=>{
    console.log(`-> ->server is connected with port ${port}`);
});




