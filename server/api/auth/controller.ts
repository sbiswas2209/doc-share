import { Request, Response, Router } from "express";
import validate from "../../middleware/validator";
import LoggerInstance from "../../utils/logger";
import Utils from "../../utils/utils";
import {
  UserLoginSchema,
  UserSignUpSchema,
  RefreshTokenSchema,
} from "./schema";
import AuthService from "./service";

class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes(): void {
    this.router.post(
      "/signUp",
      validate("body", UserSignUpSchema),
      this.handleSignUp
    );
    this.router.post(
      "/logIn",
      validate("body", UserLoginSchema),
      this.handleLogin
    );
    this.router.post(
      "/refreshToken",
      validate("body", RefreshTokenSchema),
      this.handleRefreshToken
    );
    this.router.post("/anonymousSessionSignUp", this.handleAnonymousSession);
  }

  async handleSignUp(req: Request, res: Response): Promise<void> {
    try {
      await new AuthService().signUpUser(
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.phone
      );
      res.status(201).json({
        message: "Sign Up Successful",
      });
    } catch (e: any) {
      LoggerInstance.error(e);
      res.status(e.status || 500).json({
        message: e.message || "Internal Server Error",
      });
    }
  }

  async handleLogin(req: Request, res: Response): Promise<void> {
    try {
      const token = await new AuthService().signInUser(
        req.body.email,
        req.body.password
      );
      const refreshToken = await Utils.generateRefreshToken(req.body.email);
      res.status(201).json({
        message: "Login Successful",
        token,
        refreshToken,
      });
    } catch (e: any) {
      LoggerInstance.error(e);
      res.status(e.status || 500).json({
        message: e.message || "Internal Server Error",
      });
    }
  }

  async handleRefreshToken(req: Request, res: Response) {
    try {
      const tokens = await Utils.validateRefreshToken(
        req.body.email,
        req.body.refreshToken
      );
      res.status(201).json({
        token: tokens[0],
        refreshToken: tokens[1],
      });
    } catch (e: any) {
      LoggerInstance.error(e);
      res.status(e.status || 409).json({
        message: e.message || "New token could not be generated",
      });
    }
  }

  handleAnonymousSession(req: Request, res: Response): void {
    try {
      throw {
        status: 501,
        message: "This feature will be implemented in a future update.",
      };
    } catch (e: any) {
      LoggerInstance.error(e);
      res.status(e.status || 500).json({
        message: e.message || "Internal Server Error",
      });
    }
  }
}

export default AuthRouter;
