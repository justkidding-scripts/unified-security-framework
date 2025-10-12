#!/bin/bash

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
