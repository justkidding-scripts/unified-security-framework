#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

const repositories = [
    {
        name: 'Main-C2-Framework',
        url: 'https://github.com/justkidding-scripts/Main-C2-Framework.git',
        destination: 'frameworks/c2/Main-C2-Framework',
        description: 'Comprehensive C2 infrastructure with Empire, Starkiller, and deployment automation'
    },
    {
        name: 'advanced-steganography-phishing',
        url: 'https://github.com/justkidding-scripts/advanced-steganography-phishing.git',
        destination: 'frameworks/stego/advanced-steganography-phishing',
        description: 'Advanced steganography and phishing payload distribution platform'
    },
    {
        name: 'social-engineering-framework',
        url: 'https://github.com/justkidding-scripts/social-engineering-framework.git',
        destination: 'frameworks/social/social-engineering-framework',
        description: 'Enterprise-Grade Unified Red Team Social Engineering Toolkit'
    },
    {
        name: 'offensive-tools-launcher',
        url: 'https://github.com/justkidding-scripts/offensive-tools-launcher.git',
        destination: 'gui/offensive-tools-launcher',
        description: 'Professional GUI launcher for offensive security tools'
    },
    {
        name: 'FREE-LLM-API',
        url: 'https://github.com/justkidding-scripts/FREE-LLM-API.git',
        destination: 'frameworks/llm/FREE-LLM-API',
        description: 'Complete AI Assistant with Warp Integration - Free LLM API'
    },
    {
        name: 'empire-launcher',
        url: 'https://github.com/justkidding-scripts/empire-launcher.git',
        destination: 'frameworks/c2/empire-launcher',
        description: 'Empire C2 Framework Launcher with GUI interface'
    }
];

class RepositoryCloner {
    constructor() {
        this.clonedRepos = [];
        this.failedRepos = [];
    }

    async cloneAll() {
        console.log(chalk.cyan.bold('\n🔄 UNIFIED SECURITY FRAMEWORK - Repository Integration\n'));
        console.log(chalk.yellow(`📦 Cloning ${repositories.length} repositories into unified framework...\n`));

        for (const repo of repositories) {
            await this.cloneRepository(repo);
        }

        this.displaySummary();
        await this.createIntegrationMappings();
    }

    async cloneRepository(repo) {
        const spinner = ora(`Cloning ${repo.name}...`).start();
        
        try {
            // Check if destination exists
            if (fs.existsSync(repo.destination)) {
                spinner.info(`${repo.name} already exists, updating...`);
                
                try {
                    execSync(`cd ${repo.destination} && git pull origin main || git pull origin master`, 
                             { stdio: 'pipe' });
                    spinner.succeed(`${repo.name} updated successfully`);
                } catch (pullError) {
                    spinner.warn(`${repo.name} update failed, re-cloning...`);
                    execSync(`rm -rf ${repo.destination}`, { stdio: 'pipe' });
                    await this.performClone(repo, spinner);
                }
            } else {
                await this.performClone(repo, spinner);
            }

            this.clonedRepos.push(repo);
            
        } catch (error) {
            spinner.fail(`Failed to clone ${repo.name}: ${error.message}`);
            this.failedRepos.push({ repo, error: error.message });
        }
    }

    async performClone(repo, spinner) {
        // Create destination directory
        const destDir = path.dirname(repo.destination);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Clone repository
        execSync(`git clone ${repo.url} ${repo.destination}`, { stdio: 'pipe' });
        spinner.succeed(`${repo.name} cloned successfully`);
        
        // Install dependencies if package.json exists
        const packageJsonPath = path.join(repo.destination, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            spinner.start(`Installing dependencies for ${repo.name}...`);
            try {
                execSync(`cd ${repo.destination} && npm install`, { stdio: 'pipe' });
                spinner.succeed(`Dependencies installed for ${repo.name}`);
            } catch (installError) {
                spinner.warn(`Dependency installation failed for ${repo.name}`);
            }
        }

        // Make scripts executable
        const scriptsDir = path.join(repo.destination, 'scripts');
        if (fs.existsSync(scriptsDir)) {
            try {
                execSync(`find ${scriptsDir} -name "*.sh" -exec chmod +x {} \\;`, { stdio: 'pipe' });
            } catch (chmodError) {
                // Ignore chmod errors
            }
        }
    }

    displaySummary() {
        console.log(chalk.green.bold('\n✅ REPOSITORY INTEGRATION SUMMARY\n'));
        
        if (this.clonedRepos.length > 0) {
            console.log(chalk.green(`Successfully integrated ${this.clonedRepos.length} repositories:`));
            this.clonedRepos.forEach(repo => {
                console.log(chalk.green(`  ✓ ${repo.name} -> ${repo.destination}`));
                console.log(chalk.gray(`    ${repo.description}`));
            });
        }

        if (this.failedRepos.length > 0) {
            console.log(chalk.red(`\nFailed to integrate ${this.failedRepos.length} repositories:`));
            this.failedRepos.forEach(({ repo, error }) => {
                console.log(chalk.red(`  ✗ ${repo.name}: ${error}`));
            });
        }

        console.log(chalk.cyan(`\n🎯 Integration Status: ${this.clonedRepos.length}/${repositories.length} repositories ready\n`));
    }

    async createIntegrationMappings() {
        const spinner = ora('Creating integration mappings...').start();

        try {
            const mappings = {
                repositories: this.clonedRepos.map(repo => ({
                    name: repo.name,
                    destination: repo.destination,
                    description: repo.description,
                    integrated: true,
                    lastUpdated: new Date().toISOString()
                })),
                integrationPaths: {
                    c2: [
                        'frameworks/c2/Main-C2-Framework',
                        'frameworks/c2/empire-launcher'
                    ],
                    phishing: [
                        'frameworks/stego/advanced-steganography-phishing'
                    ],
                    social: [
                        'frameworks/social/social-engineering-framework'
                    ],
                    gui: [
                        'gui/offensive-tools-launcher'
                    ],
                    llm: [
                        'frameworks/llm/FREE-LLM-API'
                    ]
                },
                launchCommands: {
                    'Main-C2-Framework': 'cd frameworks/c2/Main-C2-Framework && ./setup-complete-system.sh',
                    'advanced-steganography-phishing': 'cd frameworks/stego/advanced-steganography-phishing && ./setup-complete-system.sh',
                    'social-engineering-framework': 'cd frameworks/social/social-engineering-framework && python3 launcher/se_launcher.py',
                    'offensive-tools-launcher': 'cd gui/offensive-tools-launcher && python3 tools-launcher.py',
                    'FREE-LLM-API': 'cd frameworks/llm/FREE-LLM-API && ./launch.sh',
                    'empire-launcher': 'cd frameworks/c2/empire-launcher && python3 empire_launcher.py'
                },
                createdAt: new Date().toISOString()
            };

            // Save mappings
            fs.writeFileSync('config/repository-mappings.json', JSON.stringify(mappings, null, 2));
            
            spinner.succeed('Integration mappings created');
            
            // Create unified launcher script
            await this.createUnifiedLauncher(mappings);
            
        } catch (error) {
            spinner.fail(`Failed to create integration mappings: ${error.message}`);
        }
    }

    async createUnifiedLauncher(mappings) {
        const launcherScript = `#!/bin/bash

# Unified Security Framework Launcher
echo "🚀 UNIFIED SECURITY FRAMEWORK"
echo "================================"

# Function to launch individual components
launch_component() {
    case $1 in
        "c2")
            echo "🎯 Launching C2 Framework..."
            cd frameworks/c2/Main-C2-Framework && ./setup-complete-system.sh
            ;;
        "empire")
            echo "⚡ Launching Empire C2..."
            cd frameworks/c2/empire-launcher && python3 empire_launcher.py
            ;;
        "phishing")
            echo "🎣 Launching Phishing Platform..."
            cd frameworks/stego/advanced-steganography-phishing && ./setup-complete-system.sh
            ;;
        "social")
            echo "👥 Launching Social Engineering Framework..."
            cd frameworks/social/social-engineering-framework && python3 launcher/se_launcher.py
            ;;
        "gui")
            echo "🖥️ Launching Tools GUI..."
            cd gui/offensive-tools-launcher && python3 tools-launcher.py
            ;;
        "llm")
            echo "🤖 Launching Free LLM API..."
            cd frameworks/llm/FREE-LLM-API && ./launch.sh
            ;;
        "main")
            echo "🌟 Launching Main Framework..."
            npm start
            ;;
        *)
            echo "Usage: $0 {c2|empire|phishing|social|gui|llm|main}"
            echo ""
            echo "Available Components:"
            echo "  c2        - Main C2 Framework with Empire/Starkiller"
            echo "  empire    - Empire C2 Launcher GUI"
            echo "  phishing  - Advanced Steganography & Phishing"
            echo "  social    - Social Engineering Framework (45+ tools)"
            echo "  gui       - Offensive Tools Launcher GUI"
            echo "  llm       - Free LLM API with Warp Integration"
            echo "  main      - Unified Framework Main Server"
            exit 1
            ;;
    esac
}

# If no arguments provided, show menu
if [ $# -eq 0 ]; then
    echo ""
    echo "Select a component to launch:"
    echo "1) Main Framework (Unified Dashboard)"
    echo "2) C2 Infrastructure"
    echo "3) Empire C2 Launcher"
    echo "4) Phishing Platform"
    echo "5) Social Engineering Framework"
    echo "6) Tools GUI Launcher"
    echo "7) Free LLM API"
    echo "8) Launch All Components"
    echo ""
    read -p "Enter choice [1-8]: " choice
    
    case $choice in
        1) launch_component "main" ;;
        2) launch_component "c2" ;;
        3) launch_component "empire" ;;
        4) launch_component "phishing" ;;
        5) launch_component "social" ;;
        6) launch_component "gui" ;;
        7) launch_component "llm" ;;
        8) 
            echo "🚀 Launching all components..."
            npm start &
            sleep 5
            launch_component "c2" &
            launch_component "phishing" &
            launch_component "social" &
            echo "All components launched in background"
            ;;
        *) echo "Invalid choice" ;;
    esac
else
    launch_component $1
fi
`;

        fs.writeFileSync('launch.sh', launcherScript);
        execSync('chmod +x launch.sh');
        
        console.log(chalk.green('✅ Unified launcher created: ./launch.sh'));
        console.log(chalk.yellow('\n💡 Usage Examples:'));
        console.log(chalk.white('  ./launch.sh          # Interactive menu'));
        console.log(chalk.white('  ./launch.sh main     # Launch main framework'));
        console.log(chalk.white('  ./launch.sh c2       # Launch C2 framework'));
        console.log(chalk.white('  ./launch.sh phishing # Launch phishing platform'));
    }
}

// Run the cloner
const cloner = new RepositoryCloner();
cloner.cloneAll().catch(error => {
    console.error(chalk.red('❌ Repository cloning failed:'), error);
    process.exit(1);
});
