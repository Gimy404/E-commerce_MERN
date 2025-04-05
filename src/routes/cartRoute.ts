import express, { Request, Response } from "express";
import { getActiveCartForUser } from "../services/cartService";
import validateJWT from "../middlewares/validateJWT";

const router = express.Router();

// تعريف نوع خاص للـ Request يحتوي على user
interface AuthenticatedRequest extends Request {
  user?: any; // لو عندك نوع User ممكن تحطه بدل any
}

router.get(
  "/",
  validateJWT,
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const cart = await getActiveCartForUser({ userId });
    res.status(200).send(cart);
  }
);

export default router;
