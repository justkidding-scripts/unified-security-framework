#!/bin/bash

# API Configuration Helper for Unified Security Framework

echo "🔧 UNIFIED SECURITY FRAMEWORK - API Configuration"
echo "=================================================="
echo ""

# Function to update .env file
update_env() {
    local key=$1
    local value=$2
    local file=".env"
    
    if grep -q "^${key}=" "$file"; then
        sed -i "s|^${key}=.*|${key}=${value}|" "$file"
    else
        echo "${key}=${value}" >> "$file"
    fi
    
    echo "✅ Updated ${key}"
}

echo "This script will help you configure API keys for optimal functionality."
echo ""
echo "📋 RECOMMENDED API KEYS (all have free tiers):"
echo "1. 🚀 Groq API - Fast LLM inference (FREE)"
echo "2. 🌐 Ngrok Auth Token - Public tunneling (FREE)"
echo "3. 🔍 Shodan API - Infrastructure intelligence (FREE tier)"
echo "4. 🛡️ VirusTotal API - Malware analysis (FREE tier)"
echo ""

read -p "Do you want to configure API keys now? (y/n): " configure

if [ "$configure" = "y" ] || [ "$configure" = "Y" ]; then
    echo ""
    echo "🔑 API KEY CONFIGURATION"
    echo "========================"
    
    # Groq API Key
    echo ""
    echo "1️⃣ Groq API Key (Recommended - FREE & Fast)"
    echo "   Get it at: https://console.groq.com/keys"
    read -p "   Enter Groq API key (or press Enter to skip): " groq_key
    if [ ! -z "$groq_key" ]; then
        update_env "GROQ_API_KEY" "$groq_key"
    fi
    
    # Ngrok Auth Token
    echo ""
    echo "2️⃣ Ngrok Auth Token (For tunneling C2 & phishing)"
    echo "   Get it at: https://dashboard.ngrok.com/get-started/your-authtoken"
    read -p "   Enter Ngrok auth token (or press Enter to skip): " ngrok_token
    if [ ! -z "$ngrok_token" ]; then
        update_env "NGROK_AUTH_TOKEN" "$ngrok_token"
    fi
    
    # Shodan API Key
    echo ""
    echo "3️⃣ Shodan API Key (For OSINT & reconnaissance)"
    echo "   Get it at: https://account.shodan.io/"
    read -p "   Enter Shodan API key (or press Enter to skip): " shodan_key
    if [ ! -z "$shodan_key" ]; then
        update_env "SHODAN_API_KEY" "$shodan_key"
    fi
    
    # VirusTotal API Key
    echo ""
    echo "4️⃣ VirusTotal API Key (For malware analysis)"
    echo "   Get it at: https://www.virustotal.com/gui/join-us"
    read -p "   Enter VirusTotal API key (or press Enter to skip): " vt_key
    if [ ! -z "$vt_key" ]; then
        update_env "VIRUSTOTAL_API_KEY" "$vt_key"
    fi
    
    echo ""
    echo "✅ Configuration updated!"
    
else
    echo ""
    echo "ℹ️ Skipping API key configuration."
    echo "   You can manually edit the .env file or run this script again."
fi

echo ""
echo "🎯 FRAMEWORK STATUS CHECK"
echo "========================="

# Check current configuration
echo ""
if grep -q "your_.*_key_here" .env; then
    echo "⚠️  Some API keys still need configuration:"
    grep "your_.*_key_here" .env | sed 's/=.*//' | sed 's/^/   - /'
    echo ""
    echo "💡 For optimal functionality, configure at least Groq API key"
else
    echo "✅ All API keys configured!"
fi

echo ""
echo "🚀 READY TO LAUNCH:"
echo "   npm start           # Start main framework"
echo "   ./launch.sh         # Interactive launcher"
echo "   ./launch.sh main    # Direct web dashboard"
echo ""
echo "🌐 Web Dashboard will be available at: http://localhost:9080"
echo ""
echo "📖 For complete documentation, see README.md"
