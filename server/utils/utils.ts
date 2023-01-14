import { PrismaClient } from "@prisma/client";
import config from "./constants";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import LoggerInstance from "./logger";

class Utils {
  static getConfig() {
    return config;
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(Utils.getConfig().saltRounds);
    return await bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hashedPassword: string) {
    const hasMatch = await bcrypt.compare(password, hashedPassword);
    return hasMatch;
  }

  static signPayload(data: { id: number; name: string; email: string } | any) {
    return jwt.sign(data, Utils.getConfig().jwtSecret, {
      expiresIn: Utils.getConfig().jwtExpiry,
    });
  }

  static verifyPayload(token: string) {
    return jwt.verify(token, Utils.getConfig().jwtSecret);
  }

  static async generateRefreshToken(email: string): Promise<String> {
    const token = nanoid();
    const client = new PrismaClient();
    const data = await client.tokens.findFirst({
      where: {
        email: email,
      },
    });
    if (data) {
      await client.tokens.delete({
        where: {
          email: email,
        },
      });
    }
    await client.tokens.create({
      data: {
        refresh_token: token,
        email: email,
      },
    });
    return token;
  }

  static async validateRefreshToken(
    email: string,
    token: string
  ): Promise<String[]> {
    try {
      const client = new PrismaClient();
      await client.tokens.findFirstOrThrow({
        where: {
          refresh_token: token,
          email: email,
        },
        select: {
          id: true,
        },
      });
      await client.tokens.delete({
        where: {
          refresh_token: token,
        },
      });
      const user = await client.users.findFirstOrThrow({
        where: {
          email: email,
        },
        select: {
          id: true,
          name: true,
        },
      });
      const jwtToken = this.signPayload({
        id: user.id,
        name: user.name,
        email: email,
      });
      const refreshToken = await this.generateRefreshToken(email);
      return [jwtToken, refreshToken];
    } catch (e) {
      LoggerInstance.error(e);
      throw e;
    }
  }
}

export default Utils;
