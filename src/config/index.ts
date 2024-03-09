import * as process from 'process';
import { config } from 'dotenv';

// if injected from docker do not read environment file
if (!process.env.DB_HOST) {
  config({});
}

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
export const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } = process.env;
