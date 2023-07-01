import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongoDb/connect.js";
import userRouter from "./routes/user.route.js";
import propertyRouter from "./routes/property.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send({ message: "Hello Wrold" });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URI);
    app.listen(8080, () => console.log("app n port 8080"));
  } catch (error) {
    console.log(error);
  }
};

startServer();
