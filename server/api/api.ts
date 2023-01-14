import { Router } from "express";
import AuthRouter from "./auth/controller";

class ApiRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.use("/auth", new AuthRouter().router);
  }
}

export default ApiRouter;
