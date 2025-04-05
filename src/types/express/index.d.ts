import "express";

declare module "express" {
  interface Request {
    user?: any; // ممكن تحط النوع بدل any لو جاهز
  }
}
