import express, { Request, Response, Express } from "express";
import healthCheck from "./api/healthCheck";
import Utils from "./utils/utils";
import ApiRouter from "./api/api";
import pino from "pino";
import LoggerInstance from "./utils/logger";

class Main {
  app: Express;

  constructor() {
    this.app = express();
    this.setup();
  }

  setup(): void {
    this.app.use(express.json());
    this.app.get("/", this.root);
    this.app.get("/health", healthCheck);
    this.app.use("/api", new ApiRouter().router);
    this.app.all("*", this.routeNotFound);
    this.app.listen(Utils.getConfig().port, () => {
      LoggerInstance.info("Server Started");
    });
  }

  root(req: Request, res: Response): void {
    res.status(200).json({
      message: "doc-share server",
    });
  }

  routeNotFound(req: Request, res: Response): void {
    res.status(404).json({
      message: "The requested route was not found",
      requestedRoute: req.url,
    });
  }
}

new Main();
