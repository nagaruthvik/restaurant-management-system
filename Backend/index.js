import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import menuRouter from "./routes/menuRoutes.js";
import cors from "cors";
import orderRouter from "./routes/order.js";

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(cors());
app.use("/order",orderRouter)
app.use("/menu",menuRouter)
mongoose
  .connect(
    "mongodb+srv://nagaruthvik66:qjpoZbDTcucH2hgQ@cluster0.pgj63xs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("connected to mongodb"));

app.listen(4000, () => { 
  console.log("lisiting to 4000");
});
