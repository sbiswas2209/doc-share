import pino, { Logger } from "pino";

class LoggerInstance {
  static logger: Logger = pino({
    transport: {
      target: "pino-pretty",
    },
    options: {
      colorize: true,
    },
  });

  static info(msg: any): void {
    this.logger.info(msg);
  }

  static error(msg: any): void {
    this.logger.error(msg);
  }
  static warn(msg: any): void {
    this.logger.warn(msg);
  }

  static debug(msg: any): void {
    this.logger.debug(msg);
  }

  static fatal(msg: any): void {
    this.logger.fatal(msg);
  }
}

export default LoggerInstance;
