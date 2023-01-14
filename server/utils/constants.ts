import dotenv from "dotenv";

dotenv.config();

const config = {
  port: parseInt(process.env.PORT || "8080"),
  databasePort: parseInt(process.env.DATABASE_PORT || "5432"),
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.PASSWORD || "",
  database: process.env.DATABASE || "postgres",
  saltRounds: parseInt(process.env.SALT_ROUNDS || "10"),
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiry: process.env.JWT_EXPIRY || "1m",
};

export default config;
