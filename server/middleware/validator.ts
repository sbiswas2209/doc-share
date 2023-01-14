import { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import LoggerInstance from "../utils/logger";

export default function validate(
  location = "body" || "params",
  schema: yup.AnyObjectSchema
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let data;
      switch (location) {
        case "body":
          data = req.body;
          break;
        case "query":
          data = req.params;
          break;
        default:
          throw {
            status: 501,
            message: `Validating ${location} has not been implemented yet.`,
          };
      }
      await schema.validate(data);
      next();
    } catch (e: any) {
      LoggerInstance.error(e);
      res.status(e.status || 500).json({
        message: e.message || "Internal Server Error",
      });
    }
  };
}
