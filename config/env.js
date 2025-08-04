import {config} from "dotenv";

console.log(process.env.NODE_ENV)
const envFile = `.env.${process.env.NODE_ENV || "development"}.local`;

config({ path: envFile });

export const { PORT, SERVER_URL,NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN, ARCJET_KEY, ARCJET_ENV, QSTASH_TOKEN, QSTASH_URL, EMAIL_PASSWORD } = process.env;
