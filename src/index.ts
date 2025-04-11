import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute"; // Ensure this path is correct and the file exists
import productRoute from "./routes/productRoute"; // Import product routes
import { seedInitialProducts } from "./services/productServices";
import cartRoute from "./routes/cartRoute"; // Import cart routes

dotenv.config();

const app = express();
const port = 3002;
app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => console.log("Mongo connected!"))
  .catch((err) => console.log("Failed to connect!", err));

// Seed the products to database
seedInitialProducts();


app.use('/user',userRoute)
app.use('/product', productRoute);
app.use('/cart', cartRoute); // Use cart routes


app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});
