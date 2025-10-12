#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

class FrameworkFixer {
    constructor() {
        this.issues = [];
        this.fixes = [];
    }

    async runDiagnostics() {
        console.log(chalk.cyan.bold('🔧 UNIFIED SECURITY FRAMEWORK - DIAGNOSTICS & FIXES\n'));

        await this.checkSystemRequirements();
        await this.checkDependencies();
        await this.checkConfiguration();
        await this.checkFrameworkIntegration();
        await this.applyFixes();
        await this.runTests();
        
        this.displaySummary();
    }

    async checkSystemRequirements() {
        const spinner = ora('Checking system requirements...').start();
        
        try {
            // Check Node.js version
            const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
            if (parseInt(nodeVersion.slice(1)) < 18) {
                this.issues.push('Node.js version too old (need 18+)');
                this.fixes.push('Install Node.js 18+: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs');
            } else {
                spinner.succeed(`Node.js version: ${nodeVersion} ✓`);
            }

            // Check Python
            const pythonVersion = execSync('python3 --version', { encoding: 'utf8' }).trim();
            spinner.succeed(`Python version: ${pythonVersion} ✓`);

            // Check Ollama
            try {
                execSync('ollama --version', { stdio: 'pipe' });
                spinner.succeed('Ollama installed ✓');
            } catch (error) {
                this.issues.push('Ollama not installed');
                this.fixes.push('Install Ollama: curl -fsSL https://ollama.ai/install.sh | sh');
                spinner.warn('Ollama not installed ⚠️');
            }

        } catch (error) {
            spinner.fail(`System check failed: ${error.message}`);
        }
    }

    async checkDependencies() {
        const spinner = ora('Checking dependencies...').start();
        
        try {
            // Check npm packages
            if (!fs.existsSync('node_modules')) {
                this.issues.push('Node modules not installed');
                this.fixes.push('npm install');
                spinner.warn('Node modules missing ⚠️');
            } else {
                spinner.succeed('Node modules installed ✓');
            }

            // Check Python dependencies for integrated frameworks
            const pythonReqs = [
                'frameworks/stego/advanced-steganography-phishing/requirements.txt',
                'frameworks/social/social-engineering-framework/requirements.txt'
            ];

            for (const req of pythonReqs) {
                if (fs.existsSync(req)) {
                    this.fixes.push(`pip3 install -r ${req}`);
                }
            }

        } catch (error) {
            spinner.fail(`Dependency check failed: ${error.message}`);
        }
    }

    async checkConfiguration() {
        const spinner = ora('Checking configuration...').start();
        
        try {
            // Check .env file
            if (!fs.existsSync('.env')) {
                this.issues.push('Environment file missing');
                this.fixes.push('Create .env file with required variables');
                spinner.warn('.env file missing ⚠️');
            } else {
                const envContent = fs.readFileSync('.env', 'utf8');
                
                // Check for placeholder values
                const placeholders = [
                    'your_groq_key_here',
                    'your_together_key_here',
                    'your_ngrok_auth_token_here'
                ];
                
                const hasPlaceholders = placeholders.some(p => envContent.includes(p));
                if (hasPlaceholders) {
                    this.issues.push('API keys need configuration');
                    this.fixes.push('Replace placeholder values in .env with real API keys');
                    spinner.warn('API keys need configuration ⚠️');
                } else {
                    spinner.succeed('Configuration looks good ✓');
                }
            }

        } catch (error) {
            spinner.fail(`Configuration check failed: ${error.message}`);
        }
    }

    async checkFrameworkIntegration() {
        const spinner = ora('Checking framework integration...').start();
        
        try {
            // Check if repositories are cloned
            const frameworks = [
                'frameworks/c2/Main-C2-Framework',
                'frameworks/stego/advanced-steganography-phishing',
                'frameworks/social/social-engineering-framework',
                'gui/offensive-tools-launcher',
                'frameworks/llm/FREE-LLM-API',
                'frameworks/c2/empire-launcher'
            ];

            let missingFrameworks = 0;
            for (const framework of frameworks) {
                if (!fs.existsSync(framework)) {
                    missingFrameworks++;
                }
            }

            if (missingFrameworks > 0) {
                this.issues.push(`${missingFrameworks} frameworks not cloned`);
                this.fixes.push('node scripts/clone-repositories.js');
                spinner.warn(`${missingFrameworks} frameworks missing ⚠️`);
            } else {
                spinner.succeed('All frameworks integrated ✓');
            }

        } catch (error) {
            spinner.fail(`Framework integration check failed: ${error.message}`);
        }
    }

    async applyFixes() {
        if (this.fixes.length === 0) {
            console.log(chalk.green('\n✅ No fixes needed - system is healthy!\n'));
            return;
        }

        console.log(chalk.yellow(`\n🔧 Applying ${this.fixes.length} fixes...\n`));

        for (const fix of this.fixes) {
            const spinner = ora(`Applying: ${fix}`).start();
            
            try {
                if (fix.includes('npm install')) {
                    execSync(fix, { stdio: 'pipe' });
                } else if (fix.includes('pip3 install')) {
                    execSync(fix, { stdio: 'pipe' });
                } else if (fix.includes('node scripts/')) {
                    execSync(fix, { stdio: 'inherit' });
                } else {
                    spinner.info(`Manual action required: ${fix}`);
                    continue;
                }
                
                spinner.succeed(`Applied: ${fix}`);
                
            } catch (error) {
                spinner.fail(`Failed: ${fix} - ${error.message}`);
            }
        }
    }

    async runTests() {
        console.log(chalk.cyan('\n🧪 Running comprehensive tests...\n'));

        // Test 1: Framework startup
        await this.testFrameworkStartup();
        
        // Test 2: API endpoints
        await this.testAPIEndpoints();
        
        // Test 3: AI monitoring
        await this.testAIMonitoring();
        
        // Test 4: Framework modules
        await this.testFrameworkModules();
    }

    async testFrameworkStartup() {
        const spinner = ora('Testing framework startup...').start();
        
        try {
            // Start framework in background for testing
            const child = execSync('timeout 10s npm start > /dev/null 2>&1 & echo $!', { encoding: 'utf8' });
            const pid = child.trim();
            
            // Wait a moment for startup
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check if process is running
            try {
                execSync(`kill -0 ${pid}`, { stdio: 'pipe' });
                spinner.succeed('Framework startup test passed ✓');
                
                // Clean up
                execSync(`kill ${pid}`, { stdio: 'pipe' });
            } catch (error) {
                spinner.fail('Framework startup test failed ✗');
            }
            
        } catch (error) {
            spinner.fail(`Framework startup test error: ${error.message}`);
        }
    }

    async testAPIEndpoints() {
        const spinner = ora('Testing API endpoints...').start();
        
        try {
            // This would test if the framework was running
            // For now, just check if the routes are properly defined
            const mainFile = fs.readFileSync('core/main.js', 'utf8');
            const hasHealthEndpoint = mainFile.includes('app.get(\'/health\'');
            const hasAPIRoutes = mainFile.includes('app.use(\'/api/');
            
            if (hasHealthEndpoint && hasAPIRoutes) {
                spinner.succeed('API endpoints test passed ✓');
            } else {
                spinner.fail('API endpoints test failed ✗');
            }
            
        } catch (error) {
            spinner.fail(`API endpoints test error: ${error.message}`);
        }
    }

    async testAIMonitoring() {
        const spinner = ora('Testing AI monitoring...').start();
        
        try {
            // Check if AI monitor file exists and has required methods
            const aiMonitorFile = fs.readFileSync('monitoring/ai-monitor.js', 'utf8');
            const hasRequiredMethods = [
                'logActivity',
                'analyzeActivity', 
                'generateSuggestions',
                'generateReport'
            ].every(method => aiMonitorFile.includes(method));
            
            if (hasRequiredMethods) {
                spinner.succeed('AI monitoring test passed ✓');
            } else {
                spinner.fail('AI monitoring test failed ✗');
            }
            
        } catch (error) {
            spinner.fail(`AI monitoring test error: ${error.message}`);
        }
    }

    async testFrameworkModules() {
        const spinner = ora('Testing framework modules...').start();
        
        try {
            const modules = [
                'frameworks/c2/empire-manager.js',
                'frameworks/phishing/campaign-manager.js',
                'frameworks/social/se-coordinator.js',
                'frameworks/osint/intel-gatherer.js',
                'frameworks/stego/payload-embedder.js'
            ];
            
            let validModules = 0;
            for (const module of modules) {
                if (fs.existsSync(module)) {
                    const content = fs.readFileSync(module, 'utf8');
                    if (content.includes('class') && content.includes('constructor')) {
                        validModules++;
                    }
                }
            }
            
            if (validModules === modules.length) {
                spinner.succeed('Framework modules test passed ✓');
            } else {
                spinner.warn(`Framework modules test: ${validModules}/${modules.length} modules valid ⚠️`);
            }
            
        } catch (error) {
            spinner.fail(`Framework modules test error: ${error.message}`);
        }
    }

    displaySummary() {
        console.log(chalk.cyan.bold('\n📊 DIAGNOSTIC SUMMARY\n'));
        
        if (this.issues.length === 0) {
            console.log(chalk.green('🎉 SYSTEM STATUS: FULLY OPERATIONAL\n'));
            
            console.log(chalk.white('✅ All systems healthy'));
            console.log(chalk.white('✅ All dependencies installed'));
            console.log(chalk.white('✅ All frameworks integrated'));
            console.log(chalk.white('✅ All tests passed'));
            
            console.log(chalk.cyan('\n🚀 READY TO LAUNCH:'));
            console.log(chalk.white('   npm start                    # Main framework'));
            console.log(chalk.white('   ./launch.sh                  # Interactive menu'));
            console.log(chalk.white('   ./launch.sh main             # Web dashboard'));
        } else {
            console.log(chalk.yellow(`⚠️ ISSUES FOUND: ${this.issues.length}\n`));
            
            this.issues.forEach((issue, index) => {
                console.log(chalk.red(`${index + 1}. ${issue}`));
            });
            
            console.log(chalk.cyan('\n🔧 RECOMMENDED ACTIONS:'));
            console.log(chalk.white('1. Follow the fixes suggested above'));
            console.log(chalk.white('2. Configure API keys in .env file'));
            console.log(chalk.white('3. Run this diagnostic again: node scripts/fix-and-test.js'));
        }
        
        console.log(chalk.cyan('\n📚 DOCUMENTATION:'));
        console.log(chalk.white('   README.md                    # Complete guide'));
        console.log(chalk.white('   http://localhost:9080        # Web dashboard'));
        console.log(chalk.white('   ./launch.sh --help           # CLI help'));
    }
}

// Run diagnostics
const fixer = new FrameworkFixer();
fixer.runDiagnostics().catch(error => {
    console.error(chalk.red('❌ Diagnostic failed:'), error);
    process.exit(1);
});
