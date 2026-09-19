export type DatabaseValue = string | number | null;

export interface DatabaseClient {
  exec(sql: string): Promise<void>;
  run(sql: string, params?: DatabaseValue[]): Promise<void>;
  first<T>(sql: string, params?: DatabaseValue[]): Promise<T | null>;
  all<T>(sql: string, params?: DatabaseValue[]): Promise<T[]>;
  transaction<T>(work: (database: DatabaseClient) => Promise<T>): Promise<T>;
}
