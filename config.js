import dotenv from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

// dotEnv Config
dotenv.config()

const email_regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g

const env_db_config = JSON.parse(process.env.DB_CONFIG)

// with 24 hour of token expiration
const expirationToken = '24h'

const port = process.env.PORT || 3000
const root = dirname(fileURLToPath(import.meta.url))
const db_default_options = {
  host: process.env.DB_HOST || 'localhost',
  // user: 'pg_username',
  // password: 'pg_password',
  // database: 'db_name',
  port: Number(process.env.DB_PORT) || 5432,
  allowExitOnIdle: true
}

const db = { ...db_default_options, ...env_db_config }

export { port, root, db, email_regex, expirationToken }
