import { Request, Response, NextFunction } from "express";


export default function wrap<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  fn: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next?: NextFunction) => any
) {
  return function (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}