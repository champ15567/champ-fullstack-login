import express from "express";
import mongoose, { ConnectOptions } from "mongoose";

// Controllers
import createUserController from "./controllers/createUserController";
import loginUserController from "./controllers/loginUserController";
import authUserController from "./controllers/authUserController";
import getAllUserController from "./controllers/getAllUserController";
import editUserController from "./controllers/editUserController";
import deleteUserController from "./controllers/deleteUserController";
import getOneUserController from "./controllers/getOneUserController";

import cors from "cors";

const app = express();

// MongoDB Connection
async function connectToMongoDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://admin01:1234@cluster0.kuxn0od.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

connectToMongoDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.post("/register", createUserController);
app.post("/login", loginUserController);
app.post("/auth", authUserController);
app.get("/users", getAllUserController);
app.get("/user/:username", getOneUserController);
app.put("/edit/:username", editUserController);
app.delete("/delete/:username", deleteUserController);

app.listen(4000, () => console.log("Server is running...port 4000"));
