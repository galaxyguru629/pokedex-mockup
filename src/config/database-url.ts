/** Normalize DATABASE_URL for Supabase pooler (PgBouncer). */
export function getAppDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required');
  }

  if (url.includes(':6543') && !url.includes('pgbouncer=true')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}pgbouncer=true`;
  }

  return url;
}

/** Direct connection for migrations/seeds (avoids PgBouncer prepared-statement limits). */
export function getDirectDatabaseUrl(): string {
  if (process.env.DIRECT_URL) {
    return process.env.DIRECT_URL;
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required');
  }

  if (url.includes(':6543')) {
    return url.replace(':6543', ':5432').replace(/\?.*$/, '');
  }

  return url.replace(/\?.*$/, '');
}
