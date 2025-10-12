import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

export class DatabaseManager {
    constructor() {
        const dbDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }
        
        this.dbPath = path.join(dbDir, 'framework.db');
        this.db = null;
        this.isActive = false;
    }

    async start() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.initializeTables();
                    this.isActive = true;
                    resolve();
                }
            });
        });
    }

    initializeTables() {
        const tables = [
            `CREATE TABLE IF NOT EXISTS activities (
                id TEXT PRIMARY KEY,
                timestamp TEXT,
                module TEXT,
                action TEXT,
                data TEXT,
                context TEXT
            )`,
            `CREATE TABLE IF NOT EXISTS campaigns (
                id TEXT PRIMARY KEY,
                name TEXT,
                type TEXT,
                status TEXT,
                created TEXT,
                data TEXT
            )`,
            `CREATE TABLE IF NOT EXISTS targets (
                id TEXT PRIMARY KEY,
                name TEXT,
                type TEXT,
                data TEXT,
                created TEXT
            )`
        ];

        tables.forEach(sql => {
            this.db.run(sql);
        });
    }

    async stop() {
        return new Promise((resolve) => {
            if (this.db) {
                this.db.close((err) => {
                    this.isActive = false;
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}
