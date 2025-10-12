import winston from 'winston';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export class Logger {
    constructor() {
        // Ensure logs directory exists
        const logDir = path.join(process.cwd(), 'data', 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        this.winston = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            defaultMeta: { service: 'unified-security-framework' },
            transports: [
                new winston.transports.File({ 
                    filename: path.join(logDir, 'error.log'), 
                    level: 'error' 
                }),
                new winston.transports.File({ 
                    filename: path.join(logDir, 'combined.log') 
                }),
                new winston.transports.File({ 
                    filename: path.join(logDir, 'security.log'), 
                    level: 'warn' 
                })
            ]
        });

        // Add console transport in development
        if (process.env.NODE_ENV !== 'production') {
            this.winston.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            }));
        }
    }

    info(message, meta = {}) {
        this.winston.info(message, meta);
        console.log(chalk.blue('ℹ️'), message);
    }

    success(message, meta = {}) {
        this.winston.info(message, { ...meta, level: 'success' });
        console.log(chalk.green('✅'), message);
    }

    warn(message, meta = {}) {
        this.winston.warn(message, meta);
        console.log(chalk.yellow('⚠️'), message);
    }

    error(message, error = null, meta = {}) {
        const errorMeta = error ? { 
            ...meta, 
            error: error.message, 
            stack: error.stack 
        } : meta;
        
        this.winston.error(message, errorMeta);
        console.log(chalk.red('❌'), message);
    }

    security(action, details, meta = {}) {
        const securityMeta = {
            ...meta,
            action,
            details,
            timestamp: new Date().toISOString(),
            category: 'security'
        };
        
        this.winston.warn(`[SECURITY] ${action}`, securityMeta);
        console.log(chalk.magenta('🔒'), `[SECURITY] ${action}:`, details);
    }
}

export default Logger;
