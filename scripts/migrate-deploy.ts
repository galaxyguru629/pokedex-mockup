/**
 * Runs migrations against a direct Postgres connection.
 * Supabase pooler (port 6543) cannot run migrations — use DIRECT_URL or port 5432.
 */
import { execSync } from 'node:child_process';
import { config } from 'dotenv';
import { getDirectDatabaseUrl } from '../src/config/database-url';

config();

const migrationUrl = getDirectDatabaseUrl();

console.log('Applying migrations (direct connection)...');

execSync('npx prisma migrate deploy', {
  stdio: 'inherit',
  env: {
    ...process.env,
    DATABASE_URL: migrationUrl,
  },
});

console.log('Migrations applied.');
