import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

import { ExtendRequest } from "../types/extendedRequest";

const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader?.split(" ")[1];

  if (!token) {
    res.status(403).send("Bearer token not found");
    return;
  }

  jwt.verify(token, "oK9KVC4XRXFkcRLHFrlNwwT88akws491", async (err, payload) => {
    if (err) {
      res.status(403).send("Invalid token");
      return;
    }

    if (!payload) {
      res.status(403).send("Invalid token payload");
      return;
    }

    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
    };

    // Fetch user from database based on the payload
    const user = await userModel.findOne({ email: userPayload.email });

    req.user = user;

    next(); // ✅ علشان الطلب يكمل ويوصل للراوت
  });
};

export default validateJWT;
