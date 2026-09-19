import * as SQLite from 'expo-sqlite';

import type { DatabaseClient, DatabaseValue } from './DatabaseClient';

export class ExpoSQLiteClient implements DatabaseClient {
  private constructor(private readonly database: SQLite.SQLiteDatabase) {}

  static async open(databaseName: string) {
    const database = await SQLite.openDatabaseAsync(databaseName);
    await database.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
    return new ExpoSQLiteClient(database);
  }

  async exec(sql: string) {
    await this.database.execAsync(sql);
  }

  async run(sql: string, params: DatabaseValue[] = []) {
    await this.database.runAsync(sql, params);
  }

  async first<T>(sql: string, params: DatabaseValue[] = []) {
    return this.database.getFirstAsync<T>(sql, params);
  }

  async all<T>(sql: string, params: DatabaseValue[] = []) {
    return this.database.getAllAsync<T>(sql, params);
  }

  async transaction<T>(work: (database: DatabaseClient) => Promise<T>) {
    let result: T | undefined;
    await this.database.withTransactionAsync(async () => {
      result = await work(this);
    });
    return result as T;
  }
}
