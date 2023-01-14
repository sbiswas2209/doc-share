import { PrismaClient } from "@prisma/client";
import LoggerInstance from "../../utils/logger";
import Utils from "../../utils/utils";

class AuthService {
  client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async signUpUser(
    name: string,
    email: string,
    password: string,
    phone?: string
  ) {
    try {
      const hashedPassword = await Utils.hashPassword(password);
      const user = await this.client.users.findFirst({
        where: {
          email: email,
        },
      });
      if (user) {
        throw {
          status: 409,
          message: "User already exists",
        };
      }
      await this.client.users.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          phone: phone,
        },
      });
    } catch (e) {
      LoggerInstance.error(e);
      throw e;
    }
  }

  async signInUser(email: string, password: string): Promise<string> {
    try {
      let user = await this.client.users.findFirst({
        where: {
          email: email,
        },
        select: {
          password: true,
          name: true,
          id: true,
        },
      });
      if (!user) {
        throw {
          status: 404,
          message: "User does not exist",
        };
      }
      LoggerInstance.info(user);
      const hashedPassword = user.password;
      const name = user.name;
      const id = user.id;
      if (await Utils.comparePassword(password, hashedPassword)) {
        return Utils.signPayload({ id, name, email });
      } else {
        throw {
          status: 422,
          message: "Password Incorrect",
        };
      }
    } catch (e) {
      LoggerInstance.error(e);
      throw e;
    }
  }
}

export default AuthService;
