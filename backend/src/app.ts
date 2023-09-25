import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";

// Controllers

// Middleware
import authMiddleWare from "./middleware/authMiddleWare";

// Routes
import authController from "./controllers/authController";

// User
import createUserController from "./controllers/Users/createUserController";
import loginUserController from "./controllers/Users/loginUserController";
import getAllUserController from "./controllers/Users/getAllUserController";
import editUserController from "./controllers/Users/editUserController";
import deleteUserController from "./controllers/Users/deleteUserController";
import getOneUserController from "./controllers/Users/getOneUserController";

//Product
import createProductController from "./controllers/Product/createProductController";
import getAllProductController from "./controllers/Product/getAllProductController";
import getOneProductController from "./controllers/Product/getOneProductController";
import editProductController from "./controllers/Product/editProductController";
import deleteProductController from "./controllers/Product/deleteProductController";

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

app.post("/auth", authController);

// Users Routes
app.post("/login", loginUserController);
app.get("/users", authMiddleWare, getAllUserController);
app.get("/users/:username", authMiddleWare, getOneUserController);
app.post("/users", createUserController);
app.put("/users/:username", authMiddleWare, editUserController);
app.delete("/users/:username", authMiddleWare, deleteUserController);

// Products Routes
app.get("/products", authMiddleWare, getAllProductController);
app.get("/products/:code", authMiddleWare, getOneProductController);
app.post("/products", authMiddleWare, createProductController);
app.put("/products/:code", authMiddleWare, editProductController);
app.delete("/products/:code", authMiddleWare, deleteProductController);

app.listen(4000, () => console.log("Server is running...port 4000"));
