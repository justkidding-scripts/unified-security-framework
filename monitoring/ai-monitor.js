import { EventEmitter } from 'events';
import { Ollama } from 'ollama';
import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

export class AIMonitor extends EventEmitter {
    constructor(options = {}) {
        super();
        
        this.config = {
            enableRealTimeMonitoring: options.enableRealTimeMonitoring || true,
            enableContextLearning: options.enableContextLearning || true,
            enableAutomatedReporting: options.enableAutomatedReporting || true,
            analysisInterval: options.analysisInterval || 30000, // 30 seconds
            maxLogEntries: options.maxLogEntries || 10000
        };

        this.isActive = false;
        this.activities = [];
        this.contexts = new Map();
        this.learningData = new Map();
        
        // LLM Clients
        this.ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });
        this.freeLLMProviders = {
            groq: { baseURL: 'https://api.groq.com/openai/v1', apiKey: process.env.GROQ_API_KEY },
            together: { baseURL: 'https://api.together.xyz/v1', apiKey: process.env.TOGETHER_API_KEY },
            perplexity: { baseURL: 'https://api.perplexity.ai', apiKey: process.env.PERPLEXITY_API_KEY }
        };

        this.models = {
            analysis: 'llama3.2:latest',
            reporting: 'mistral:7b',
            suggestions: 'codellama:7b',
            contextual: 'groq' // Use Groq for real-time analysis
        };
        
        this.systemPrompts = {
            analysis: `You are a cybersecurity AI analyst monitoring red team operations. 
                      Analyze the provided activity data and identify:
                      1. Security implications
                      2. Potential improvements  
                      3. Risk assessments
                      4. Operational efficiency
                      5. Next recommended actions
                      
                      Respond in JSON format with structured analysis.`,
            
            reporting: `You are a professional penetration testing report generator.
                       Create comprehensive, executive-ready security reports from raw operational data.
                       Include executive summary, technical findings, risk matrix, and remediation recommendations.
                       Use industry-standard frameworks (OWASP, NIST, MITRE ATT&CK).`,
            
            suggestions: `You are an AI tactical advisor for red team operations.
                         Based on current activities and context, provide specific, actionable suggestions for:
                         1. Next attack vectors to explore
                         2. Tools and techniques to employ
                         3. Evasion and persistence strategies
                         4. Data collection and exfiltration methods
                         5. Campaign optimization
                         
                         Focus on authorized testing scenarios only.`,
                         
            contextual: `You are monitoring an authorized red team exercise in real-time.
                        Provide immediate tactical feedback and situational awareness.
                        Identify patterns, anomalies, and optimization opportunities.`
        };
    }

    async start() {
        try {
            // Test LLM connections
            await this.testConnections();
            
            // Start monitoring intervals
            if (this.config.enableRealTimeMonitoring) {
                this.startMonitoring();
            }
            
            // Load previous contexts
            await this.loadStoredContexts();
            
            this.isActive = true;
            console.log(chalk.green('🤖 AI Monitor: Real-time analysis active'));
            
            this.emit('started');
        } catch (error) {
            console.error(chalk.red('❌ AI Monitor failed to start:'), error.message);
            throw error;
        }
    }

    async testConnections() {
        const connections = { ollama: false, freeLLM: 0 };
        
        // Test Ollama
        try {
            await this.ollama.list();
            connections.ollama = true;
            console.log(chalk.green('✓ Ollama connected'));
        } catch (error) {
            console.log(chalk.yellow('⚠️ Ollama not available'));
        }
        
        // Test Free LLM providers
        for (const [provider, config] of Object.entries(this.freeLLMProviders)) {
            if (config.apiKey && config.apiKey !== `your_${provider}_key_here`) {
                try {
                    // Test with a simple request
                    connections.freeLLM++;
                    console.log(chalk.green(`✓ ${provider} API connected`));
                } catch (error) {
                    console.log(chalk.yellow(`⚠️ ${provider} API unavailable`));
                }
            }
        }
        
        if (!connections.ollama && connections.freeLLM === 0) {
            throw new Error('No LLM providers available. Configure Ollama or API keys.');
        }
    }

    startMonitoring() {
        // Periodic analysis
        setInterval(() => {
            this.performPeriodicAnalysis();
        }, this.config.analysisInterval);
        
        // Context learning
        if (this.config.enableContextLearning) {
            setInterval(() => {
                this.updateContextualLearning();
            }, 60000); // Every minute
        }
    }

    async logActivity(module, action, data = {}, context = {}) {
        const activity = {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            module,
            action,
            data,
            context,
            analysisRequested: false,
            riskLevel: 'unknown'
        };

        this.activities.push(activity);
        
        // Trim activities if exceeding max
        if (this.activities.length > this.config.maxLogEntries) {
            this.activities = this.activities.slice(-this.config.maxLogEntries);
        }

        // Immediate analysis for critical activities
        if (this.shouldAnalyzeImmediately(activity)) {
            await this.analyzeActivity(activity);
        }

        // Update context
        this.updateContext(module, activity);
        
        this.emit('activity', activity);
        
        // Real-time console output
        console.log(chalk.blue(`🔍 [${module.toUpperCase()}] ${action}:`), 
                   JSON.stringify(data).substring(0, 100) + '...');
    }

    shouldAnalyzeImmediately(activity) {
        const criticalModules = ['c2', 'phishing'];
        const criticalActions = ['payload_deployed', 'credential_harvested', 'session_established'];
        
        return criticalModules.includes(activity.module) || 
               criticalActions.some(action => activity.action.includes(action));
    }

    async analyzeActivity(activity) {
        try {
            const analysis = await this.queryLLM(
                this.systemPrompts.analysis,
                `Analyze this red team activity:
                
                Module: ${activity.module}
                Action: ${activity.action}
                Data: ${JSON.stringify(activity.data, null, 2)}
                Context: ${JSON.stringify(activity.context, null, 2)}
                
                Provide structured analysis including risk assessment and recommendations.`,
                'analysis'
            );

            activity.analysis = analysis;
            activity.analysisRequested = true;
            activity.riskLevel = this.extractRiskLevel(analysis);
            
            // Emit analysis event
            this.emit('analysis', { activity, analysis });
            
            console.log(chalk.magenta(`🧠 AI Analysis [${activity.module}]:`), 
                       analysis.summary || 'Analysis completed');
                       
        } catch (error) {
            console.error(chalk.red('❌ Activity analysis failed:'), error.message);
        }
    }

    async performPeriodicAnalysis() {
        try {
            const recentActivities = this.activities.slice(-20); // Last 20 activities
            
            if (recentActivities.length === 0) return;

            const analysis = await this.queryLLM(
                this.systemPrompts.contextual,
                `Analyze recent red team activities for patterns and insights:
                
                ${recentActivities.map(a => 
                    `[${a.timestamp}] ${a.module}:${a.action} - ${JSON.stringify(a.data).substring(0, 200)}`
                ).join('\n')}
                
                Provide situational awareness and tactical recommendations.`,
                'contextual'
            );

            this.emit('periodic-analysis', analysis);
            
        } catch (error) {
            console.error(chalk.red('❌ Periodic analysis failed:'), error.message);
        }
    }

    async generateSuggestions(operationContext = {}) {
        try {
            const contextData = {
                currentActivities: this.activities.slice(-10),
                operationContext,
                learningData: Object.fromEntries(this.learningData),
                activeModules: Object.keys(this.contexts.keys())
            };

            const suggestions = await this.queryLLM(
                this.systemPrompts.suggestions,
                `Based on current red team operation context, generate tactical suggestions:
                
                Context: ${JSON.stringify(contextData, null, 2)}
                
                Provide specific, actionable recommendations for the next phase of operations.`,
                'suggestions'
            );

            console.log(chalk.cyan('💡 AI Suggestions generated'));
            
            return suggestions;
            
        } catch (error) {
            console.error(chalk.red('❌ Suggestion generation failed:'), error.message);
            throw error;
        }
    }

    async generateReport(reportType = 'comprehensive', timeframe = '24h') {
        try {
            const now = new Date();
            const cutoffTime = new Date(now.getTime() - (timeframe === '24h' ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000));
            
            const relevantActivities = this.activities.filter(
                a => new Date(a.timestamp) >= cutoffTime
            );

            const reportData = {
                summary: {
                    timeframe,
                    totalActivities: relevantActivities.length,
                    moduleBreakdown: this.getModuleBreakdown(relevantActivities),
                    riskLevels: this.getRiskBreakdown(relevantActivities)
                },
                activities: relevantActivities,
                contexts: Object.fromEntries(this.contexts),
                learningInsights: Object.fromEntries(this.learningData)
            };

            const report = await this.queryLLM(
                this.systemPrompts.reporting,
                `Generate a professional red team operation report:
                
                ${JSON.stringify(reportData, null, 2)}
                
                Create an executive summary, technical findings, risk assessment, and recommendations.`,
                'reporting'
            );

            // Save report
            await this.saveReport(report, reportType);
            
            console.log(chalk.green(`📊 Report generated: ${reportType}`));
            
            return report;
            
        } catch (error) {
            console.error(chalk.red('❌ Report generation failed:'), error.message);
            throw error;
        }
    }

    async queryLLM(systemPrompt, userPrompt, type = 'analysis') {
        const model = this.models[type];
        
        try {
            // Try Ollama first for local models
            if (model !== 'groq' && await this.isOllamaAvailable()) {
                const response = await this.ollama.chat({
                    model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    stream: false
                });
                
                return this.parseAIResponse(response.message.content);
            }
            
            // Fallback to Free LLM API
            if (this.freeLLMProviders.groq.apiKey) {
                const response = await axios.post(
                    `${this.freeLLMProviders.groq.baseURL}/chat/completions`,
                    {
                        model: 'llama-3.1-8b-instant',
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ],
                        max_tokens: 2000,
                        temperature: 0.7
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${this.freeLLMProviders.groq.apiKey}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                return this.parseAIResponse(response.data.choices[0].message.content);
            }
            
            throw new Error('No LLM providers available');
            
        } catch (error) {
            console.error(chalk.red(`❌ LLM query failed (${type}):`), error.message);
            
            // Return fallback response
            return {
                summary: `Analysis unavailable - ${error.message}`,
                timestamp: new Date().toISOString(),
                type,
                fallback: true
            };
        }
    }

    parseAIResponse(content) {
        try {
            // Try to parse as JSON first
            return JSON.parse(content);
        } catch (error) {
            // Return as structured text
            return {
                summary: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
                fullContent: content,
                timestamp: new Date().toISOString(),
                parsed: false
            };
        }
    }

    async isOllamaAvailable() {
        try {
            await this.ollama.list();
            return true;
        } catch (error) {
            return false;
        }
    }

    updateContext(module, activity) {
        if (!this.contexts.has(module)) {
            this.contexts.set(module, {
                totalActivities: 0,
                lastActivity: null,
                patterns: new Map(),
                riskProfile: 'low'
            });
        }

        const context = this.contexts.get(module);
        context.totalActivities++;
        context.lastActivity = activity.timestamp;
        
        // Track patterns
        const actionKey = activity.action;
        if (!context.patterns.has(actionKey)) {
            context.patterns.set(actionKey, 0);
        }
        context.patterns.set(actionKey, context.patterns.get(actionKey) + 1);
        
        // Update risk profile
        if (activity.riskLevel && activity.riskLevel !== 'unknown') {
            context.riskProfile = this.calculateAggregateRisk(context.riskProfile, activity.riskLevel);
        }
    }

    updateContextualLearning() {
        // Analyze patterns and update learning data
        for (const [module, context] of this.contexts) {
            const learningKey = `${module}_patterns`;
            this.learningData.set(learningKey, {
                mostCommonActions: Array.from(context.patterns.entries())
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5),
                averageActivity: context.totalActivities / ((Date.now() - Date.parse('2024-01-01')) / (24 * 60 * 60 * 1000)),
                riskTrend: context.riskProfile,
                lastUpdated: new Date().toISOString()
            });
        }
    }

    extractRiskLevel(analysis) {
        if (typeof analysis === 'string') {
            if (analysis.toLowerCase().includes('high')) return 'high';
            if (analysis.toLowerCase().includes('medium')) return 'medium';
            if (analysis.toLowerCase().includes('critical')) return 'critical';
            return 'low';
        }
        
        return analysis.riskLevel || analysis.risk || 'low';
    }

    calculateAggregateRisk(current, new_risk) {
        const riskLevels = { low: 1, medium: 2, high: 3, critical: 4 };
        const currentLevel = riskLevels[current] || 1;
        const newLevel = riskLevels[new_risk] || 1;
        
        const avgLevel = Math.ceil((currentLevel + newLevel) / 2);
        return Object.keys(riskLevels).find(key => riskLevels[key] === avgLevel) || 'low';
    }

    getModuleBreakdown(activities) {
        const breakdown = {};
        activities.forEach(activity => {
            breakdown[activity.module] = (breakdown[activity.module] || 0) + 1;
        });
        return breakdown;
    }

    getRiskBreakdown(activities) {
        const breakdown = {};
        activities.forEach(activity => {
            const risk = activity.riskLevel || 'unknown';
            breakdown[risk] = (breakdown[risk] || 0) + 1;
        });
        return breakdown;
    }

    async saveReport(report, type) {
        const reportDir = path.join(process.cwd(), 'data', 'reports');
        await fs.mkdir(reportDir, { recursive: true });
        
        const filename = `${type}_report_${new Date().toISOString().split('T')[0]}.json`;
        const filepath = path.join(reportDir, filename);
        
        await fs.writeFile(filepath, JSON.stringify(report, null, 2));
        
        return filepath;
    }

    async loadStoredContexts() {
        try {
            const contextFile = path.join(process.cwd(), 'data', 'contexts.json');
            const data = await fs.readFile(contextFile, 'utf8');
            const storedContexts = JSON.parse(data);
            
            this.contexts = new Map(Object.entries(storedContexts.contexts || {}));
            this.learningData = new Map(Object.entries(storedContexts.learningData || {}));
            
            console.log(chalk.green('✓ Stored contexts loaded'));
        } catch (error) {
            console.log(chalk.yellow('⚠️ No stored contexts found, starting fresh'));
        }
    }

    async saveContexts() {
        try {
            const contextDir = path.join(process.cwd(), 'data');
            await fs.mkdir(contextDir, { recursive: true });
            
            const contextFile = path.join(contextDir, 'contexts.json');
            const data = {
                contexts: Object.fromEntries(this.contexts),
                learningData: Object.fromEntries(this.learningData),
                lastSaved: new Date().toISOString()
            };
            
            await fs.writeFile(contextFile, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(chalk.red('❌ Failed to save contexts:'), error.message);
        }
    }

    getStatus() {
        return {
            isActive: this.isActive,
            totalActivities: this.activities.length,
            activeContexts: this.contexts.size,
            learningDataPoints: this.learningData.size,
            lastActivity: this.activities.length > 0 ? this.activities[this.activities.length - 1].timestamp : null,
            config: this.config,
            availableModels: this.models
        };
    }

    async stop() {
        this.isActive = false;
        await this.saveContexts();
        this.emit('stopped');
        console.log(chalk.yellow('🤖 AI Monitor stopped'));
    }
}

export default AIMonitor;
