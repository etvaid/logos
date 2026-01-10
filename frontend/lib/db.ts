// Database client mock for frontend
// In production, all database access goes through the backend API

export function getPool(): never {
  throw new Error('Direct database access not available in frontend. Use API endpoints instead.');
}

export async function query<T = Record<string, unknown>>(
  _text: string,
  _params?: unknown[]
): Promise<T[]> {
  console.warn('Direct database query not available in frontend. Use API endpoints instead.');
  return [];
}

export async function queryOne<T = Record<string, unknown>>(
  _text: string,
  _params?: unknown[]
): Promise<T | null> {
  console.warn('Direct database query not available in frontend. Use API endpoints instead.');
  return null;
}

export async function transaction<T>(
  _callback: (client: unknown) => Promise<T>
): Promise<T> {
  throw new Error('Transactions not available in frontend. Use API endpoints instead.');
}
