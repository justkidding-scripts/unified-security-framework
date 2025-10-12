#!/usr/bin/env node

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';

// Core Framework Modules
import { AIMonitor } from '../monitoring/ai-monitor.js';
import { C2Manager } from '../frameworks/c2/empire-manager.js';
import { PhishingManager } from '../frameworks/phishing/campaign-manager.js';
import { SocialEngineeringCoordinator } from '../frameworks/social/se-coordinator.js';
import { OSINTGatherer } from '../frameworks/osint/intel-gatherer.js';
import { SteganographyManager } from '../frameworks/stego/payload-embedder.js';
import { TunnelManager } from './tunnel-manager.js';
import { DatabaseManager } from './database-manager.js';
import { Logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

class UnifiedSecurityFramework {
    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = new Server(this.server, {
            cors: { origin: "*", methods: ["GET", "POST"] }
        });
        
        this.port = process.env.PORT || 8080;
        this.modules = {};
        this.aiMonitor = null;
        this.logger = new Logger();
        
        this.displayBanner();
        this.initializeFramework();
    }

    displayBanner() {
        console.clear();
        console.log(chalk.cyan(figlet.textSync('UNIFIED', { horizontalLayout: 'full' })));
        console.log(chalk.magenta(figlet.textSync('SECURITY', { horizontalLayout: 'full' })));
        console.log(chalk.yellow(figlet.textSync('FRAMEWORK', { horizontalLayout: 'full' })));
        
        console.log(boxen(
            chalk.white.bold('🚀 AI-Powered Red Team Operations Platform\n\n') +
            chalk.green('✓ C2 Infrastructure Management\n') +
            chalk.green('✓ Advanced Phishing Campaigns\n') +
            chalk.green('✓ Social Engineering Automation\n') +
            chalk.green('✓ OSINT & Intelligence Gathering\n') +
            chalk.green('✓ Steganographic Payload Delivery\n') +
            chalk.green('✓ Real-time AI Monitoring\n') +
            chalk.green('✓ Automated Reporting & Analytics\n\n') +
            chalk.yellow('⚠️  FOR AUTHORIZED TESTING ONLY ⚠️'),
            {
                title: '🎯 Ultimate Red Team Toolkit',
                titleAlignment: 'center',
                padding: 1,
                margin: 1,
                borderStyle: 'double',
                borderColor: 'cyan'
            }
        ));
    }

    async initializeFramework() {
        try {
            this.logger.info('🚀 Initializing Unified Security Framework...');

            // Initialize core components
            this.modules.database = new DatabaseManager();
            this.modules.tunnels = new TunnelManager();
            
            // Initialize AI Monitor (LLM Integration)
            this.aiMonitor = new AIMonitor({
                enableRealTimeMonitoring: true,
                enableContextLearning: true,
                enableAutomatedReporting: true
            });

            // Initialize Framework Modules
            this.modules.c2 = new C2Manager(this.aiMonitor);
            this.modules.phishing = new PhishingManager(this.aiMonitor);
            this.modules.social = new SocialEngineeringCoordinator(this.aiMonitor);
            this.modules.osint = new OSINTGatherer(this.aiMonitor);
            this.modules.steganography = new SteganographyManager(this.aiMonitor);

            // Setup Express middleware and routes
            this.setupMiddleware();
            this.setupRoutes();
            this.setupWebSocket();

            // Start all modules
            await this.startModules();

            // Start web server
            await this.startServer();

            this.logger.success('🎉 Framework initialization complete!');
            this.displayStatus();

        } catch (error) {
            this.logger.error('💥 Framework initialization failed:', error);
            process.exit(1);
        }
    }

    setupMiddleware() {
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(express.static(path.join(__dirname, '../web/dashboard')));
        
        // CORS for development
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            next();
        });
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'operational',
                timestamp: new Date().toISOString(),
                modules: {
                    c2: this.modules.c2?.isActive || false,
                    phishing: this.modules.phishing?.isActive || false,
                    social: this.modules.social?.isActive || false,
                    osint: this.modules.osint?.isActive || false,
                    steganography: this.modules.steganography?.isActive || false,
                    aiMonitor: this.aiMonitor?.isActive || false
                }
            });
        });

        // Main dashboard
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../web/dashboard/index.html'));
        });

        // API Routes
        this.app.use('/api/c2', this.createModuleRoute('c2'));
        this.app.use('/api/phishing', this.createModuleRoute('phishing'));
        this.app.use('/api/social', this.createModuleRoute('social'));
        this.app.use('/api/osint', this.createModuleRoute('osint'));
        this.app.use('/api/steganography', this.createModuleRoute('steganography'));
        this.app.use('/api/ai', this.createAIRoute());
        this.app.use('/api/tunnels', this.createTunnelRoute());
    }

    createModuleRoute(moduleName) {
        const router = express.Router();
        
        router.get('/status', (req, res) => {
            const module = this.modules[moduleName];
            res.json({
                active: module?.isActive || false,
                stats: module?.getStats ? module.getStats() : {},
                lastActivity: module?.lastActivity || null
            });
        });

        router.post('/execute', async (req, res) => {
            try {
                const module = this.modules[moduleName];
                const result = await module.execute(req.body);
                
                // Log to AI Monitor
                this.aiMonitor.logActivity(moduleName, req.body, result);
                
                res.json({ success: true, result });
            } catch (error) {
                this.logger.error(`${moduleName} execution error:`, error);
                res.status(500).json({ success: false, error: error.message });
            }
        });

        return router;
    }

    createAIRoute() {
        const router = express.Router();
        
        router.get('/status', (req, res) => {
            res.json(this.aiMonitor.getStatus());
        });

        router.post('/analyze', async (req, res) => {
            try {
                const analysis = await this.aiMonitor.analyzeOperation(req.body);
                res.json({ success: true, analysis });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        router.post('/suggest', async (req, res) => {
            try {
                const suggestions = await this.aiMonitor.generateSuggestions(req.body);
                res.json({ success: true, suggestions });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        return router;
    }

    createTunnelRoute() {
        const router = express.Router();
        
        router.get('/list', async (req, res) => {
            const tunnels = await this.modules.tunnels.listTunnels();
            res.json({ success: true, tunnels });
        });

        router.post('/create', async (req, res) => {
            try {
                const tunnel = await this.modules.tunnels.createTunnel(req.body);
                this.aiMonitor.logActivity('tunnel', 'create', tunnel);
                res.json({ success: true, tunnel });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        return router;
    }

    setupWebSocket() {
        this.io.on('connection', (socket) => {
            this.logger.info(`🔌 Client connected: ${socket.id}`);

            // Real-time AI monitoring updates
            socket.on('subscribe-monitoring', () => {
                this.aiMonitor.on('activity', (data) => {
                    socket.emit('ai-activity', data);
                });
            });

            // Module-specific subscriptions
            socket.on('subscribe-module', (moduleName) => {
                const module = this.modules[moduleName];
                if (module) {
                    module.on('update', (data) => {
                        socket.emit(`${moduleName}-update`, data);
                    });
                }
            });

            socket.on('disconnect', () => {
                this.logger.info(`🔌 Client disconnected: ${socket.id}`);
            });
        });
    }

    async startModules() {
        for (const [name, module] of Object.entries(this.modules)) {
            try {
                if (module.start) {
                    await module.start();
                    this.logger.success(`✅ ${name.toUpperCase()} module started`);
                }
            } catch (error) {
                this.logger.warn(`⚠️ ${name.toUpperCase()} module failed to start:`, error.message);
            }
        }

        // Start AI Monitor
        await this.aiMonitor.start();
        this.logger.success('🤖 AI Monitor started');
    }

    async startServer() {
        return new Promise((resolve) => {
            this.server.listen(this.port, () => {
                this.logger.success(`🌐 Framework running on http://localhost:${this.port}`);
                resolve();
            });
        });
    }

    displayStatus() {
        console.log('\n' + boxen(
            chalk.white.bold('🚀 FRAMEWORK STATUS\n\n') +
            chalk.green(`✓ Web Dashboard: http://localhost:${this.port}\n`) +
            chalk.green(`✓ AI Monitor: ${this.aiMonitor.isActive ? 'Active' : 'Inactive'}\n`) +
            chalk.green(`✓ C2 Manager: ${this.modules.c2?.isActive ? 'Ready' : 'Standby'}\n`) +
            chalk.green(`✓ Phishing Campaigns: ${this.modules.phishing?.isActive ? 'Ready' : 'Standby'}\n`) +
            chalk.green(`✓ Social Engineering: ${this.modules.social?.isActive ? 'Ready' : 'Standby'}\n`) +
            chalk.green(`✓ OSINT Gathering: ${this.modules.osint?.isActive ? 'Ready' : 'Standby'}\n`) +
            chalk.green(`✓ Steganography: ${this.modules.steganography?.isActive ? 'Ready' : 'Standby'}\n\n`) +
            chalk.yellow('💡 Use the web dashboard or API endpoints to interact with modules'),
            {
                title: '🎯 System Ready',
                titleAlignment: 'center',
                padding: 1,
                borderStyle: 'round',
                borderColor: 'green'
            }
        ));
    }

    async shutdown() {
        this.logger.info('🛑 Shutting down framework...');
        
        // Stop all modules
        for (const [name, module] of Object.entries(this.modules)) {
            if (module.stop) {
                await module.stop();
                this.logger.info(`✅ ${name.toUpperCase()} module stopped`);
            }
        }

        // Stop AI monitor
        if (this.aiMonitor) {
            await this.aiMonitor.stop();
        }

        this.server.close();
        process.exit(0);
    }
}

// Graceful shutdown
process.on('SIGTERM', () => framework.shutdown());
process.on('SIGINT', () => framework.shutdown());
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Start the framework
const framework = new UnifiedSecurityFramework();

export default framework;
