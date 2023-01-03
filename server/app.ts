import express, { Request, Response } from "express";
import healthCheck from "./utils/healthCheck";

function main() {
  const app = express();
  app.get("/", root);
  app.get("/health", healthCheck);
  app.use("/app", app);
  app.all("*", routeNotFound);
}

function root(req: Request, res: Response) {
  res.status(200).json({
    message: "doc-share server",
  });
}

function routeNotFound(req: Request, res: Response) {
  res.status(404).json({
    message: "The requested route was not found",
    requestedRoute: req.url,
  });
}

main();
