import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute"; // Ensure this path is correct and the file exists

const app = express();
const port = 3002;
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("Mongo connected!"))
  .catch((err) => console.log("Failed to connect!", err));

app.use('/user',userRoute)

app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});
