import { Request, Response, NextFunction } from "express";

export default function wrap<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  fn: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next?: NextFunction) => any
) {
  return function (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
  ) {
    if (typeof fn !== "function") {
      return next(new Error("wrap error: controller is not a function (check import/export)"));
    }

    Promise.resolve(fn(req, res, next)).catch(next);
  };
}