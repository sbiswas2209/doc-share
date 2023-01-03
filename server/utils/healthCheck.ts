import { Request, Response } from "express";
import * as os from "os";

export default function healthCheck(req: Request, res: Response) {
  res.status(200).json({
    uptime: os.uptime(),
    message: "Server is up and running",
  });
}
