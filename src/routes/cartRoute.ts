import express, { Request, Response } from "express";
import { addItemToCart, getActiveCartForUser, updateItemInCart } from "../services/cartService";
import validateJWT from "../middlewares/validateJWT";
import { ExtendRequest } from "../types/extendedRequest";

const router = express.Router();

// تعريف نوع خاص للـ Request يحتوي على user
interface AuthenticatedRequest extends Request {
  user?: any; // لو عندك نوع User ممكن تحطه بدل any
}

router.get(
  "/",
  validateJWT,
  async (req: ExtendRequest, res) => {
    const userId = req?.user?._id;
    const cart = await getActiveCartForUser({ userId });
    res.status(200).send(cart);
  }
);

router.post("/items", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req?.user?._id;
  const { productId, quantity } = req.body;
  const response = await addItemToCart({ userId, productId, quantity });
  res.status(response.statusCode).send(response.data);
});

router.put("/items", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req?.user?._id;
  const { productId, quantity } = req.body;
  const response = await updateItemInCart({ userId, productId, quantity });
  res.status(response.statusCode).send(response.data); // ✅ ده السطر اللي كان ناقص
});

export default router;
