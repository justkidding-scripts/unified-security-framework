# UNIFIED SECURITY FRAMEWORK v2.0

**The Ultimate AI-Powered Operations Platform**

A comprehensive, AI-monitored security framework that merges 6 powerful repositories into a single, unified platform for authorized and security research.

## **SUCCESSFULLY INTEGRATED FRAMEWORKS**

 **Main-C2-Framework** - Empire/Starkiller C2 infrastructure
 **Advanced-Steganography-Phishing** - Payload distribution platform
 **Social-Engineering-Framework** - 45+ integrated SE tools
 **Offensive-Tools-Launcher** - GUI tool management
 **FREE-LLM-API** - Warp-integrated AI assistant
 **Empire-Launcher** - C2 GUI interface

## **AI-POWERED FEATURES**

- **Real-time Monitoring**: Every action analyzed by LLM
- **Contextual Learning**: AI learns from your operations
- **Automated Reporting**: Professional reports
- **Tactical Suggestions**: AI-driven next steps
- **Risk Assessment**: Continuous risk evaluation
- **Pattern Recognition**: Behavioral analysis

## **CURRENT STATUS**

```
 Web Dashboard: http/localhost:9080
 AI Monitor: ACTIVE (Ollama + Free LLMs)
 All 6 Frameworks: INTEGRATED & READY
 Security Logging: COMPREHENSIVE
 Real-time Analytics: ENABLED
```

## **QUICK START**

### Option 1: Interactive Menu
```bash
./launch.sh
```

### Option 2: Direct Launch
```bash
./launch.sh main # Main unified dashboard
./launch.sh c2 # C2 infrastructure
./launch.sh phishing # Phishing platform
./launch.sh social # Social engineering
./launch.sh gui # Tools launcher
./launch.sh llm # Free LLM API
```

### Option 3: Individual Components
```bash
npm start # Main framework
npm run empire # Empire C2 manager
npm run phishing # Phishing campaigns
npm run social # Social engineering
npm run osint # OSINT gathering
npm run stego # Steganography
```

## **RECOMMENDED WORKFLOW**

1. **Start Main Framework**: `npm start`
2. **Access Dashboard**: http/localhost:9080
3. **Configure API Keys**: Edit `.env` file
4. **Launch Components**: Use web interface or CLI
5. **Monitor AI Analysis**: Real-time in dashboard
6. **Generate Reports**: AI-powered comprehensive reports

## **CONFIGURATION**

### Essential API Keys (.env)
```env
# LLM Integration (for AI monitoring)
GROQ_API_KEY=your_groq_key_here # Free, fast inference
TOGETHER_API_KEY=your_together_key_here # Multiple models
PERPLEXITY_API_KEY=your_perplexity_key # Research-focused

# Tunneling (for C2 & phishing)
NGROK_AUTH_TOKEN=your_ngrok_token_here # Public tunnels

# OSINT Enhancement
SHODAN_API_KEY=your_shodan_key_here # Infrastructure intel
VIRUSTOTAL_API_KEY=your_vt_key_here # Malware analysis
```

### Get Free API Keys
- **Groq**: https/console.groq.com/keys (Fastest LLM inference)
- **Together**: https/api.together.xyz/settings/api-keys (Multiple models)
- **Ngrok**: https/dashboard.ngrok.com/get-started/your-authtoken
- **Shodan**: https/account.shodan.io/ (Free tier available)

## **FRAMEWORK CAPABILITIES**

### ‍️ **C2 Infrastructure**
- **Empire/Starkiller** deployment automation
- **Agent management** with AI analysis
- **Payload generation** and delivery
- **Session handling** with risk assessment

### **Advanced Phishing**
- **Steganographic payloads** in images
- **Telegram web cloning** for credentials
- **Cloudflare Workers** for distribution
- **AI-optimized** social engineering

### **Social Engineering**
- **45+ integrated tools** (GoPhish, King Phisher, etc.)
- **Unified CLI interface** with TUI
- **Campaign management** and tracking
- **Credential harvesting** centralization

### **OSINT & Intelligence**
- **Automated reconnaissance** with AI correlation
- **Multi-source aggregation** (Shodan, VirusTotal, etc.)
- **Threat intelligence** analysis and attribution
- **Real-time monitoring** and alerting

### ️ **Steganography & Evasion**
- **Payload embedding** in multimedia
- **AV evasion techniques** with success scoring
- **Polymorphic generation** using AI
- **Detection analysis** and optimization

## **AI MONITORING EXAMPLES**

The AI continuously analyzes all operations:

```
 [C2] agent_deployed: {"target": "192.168.1.100", "method": "powershell"}
 AI Analysis: High-value target identified. Recommend persistence mechanisms.
 Suggestion: Deploy Mimikatz for credential harvesting.

 [PHISHING] campaign_launched: {"targets": 150, "template": "office365"}
 AI Analysis: Campaign parameters optimal. Monitor for email security bypasses.
 Suggestion: Prepare credential harvesting infrastructure.

 [OSINT] intel_gathered: {"domain": "target.com", "subdomains": 23}
 AI Analysis: Large attack surface discovered. Prioritize subdomain takeover.
 Suggestion: Focus on dev/staging environments for initial access.
```

## **ADVANCED FEATURES**

### **AI Capabilities**
- **Pattern Recognition**: Identifies successful attack vectors
- **Risk Scoring**: CVSS-based vulnerability assessment
- **Behavioral Learning**: Adapts to your testing methodology
- **Automated Documentation**: Generates professional reports
- **Context Awareness**: Understands campaign relationships

### **Security & Compliance**
- **Comprehensive Logging**: Every action logged and analyzed
- **Audit Trails**: Complete operation history
- **Risk Assessment**: Continuous impact evaluation
- ** Guidelines**: Built-in responsible disclosure
- **Authorization Checks**: Scope validation and confirmation

### **Integration Points**
- **Warp Terminal**: Full environment integration
- **MCP Servers**: Linear, Figma, Slack, GitHub, Sentry
- **External APIs**: Shodan, VirusTotal, Censys integration
- **Tunnel Management**: Ngrok automation for exposure
- **Real-time Collaboration**: WebSocket-based updates

## **USE CASES**

### ** Operations**
1. **Infrastructure Deployment**: Automated C2 setup
2. **Initial Access**: Multi-vector phishing campaigns
3. **Lateral Movement**: AI-guided progression
4. **Persistence**: Steganographic implants
5. **Exfiltration**: Covert data channels

### ** Training**
1. **Attack Simulation**: Realistic threat scenarios
2. **Detection Testing**: Validate security controls
3. **Awareness Training**: Phishing simulations
4. **Incident Response**: Practice threat hunting
5. **Tool Evaluation**: Test security products

### ****
1. **Reconnaissance**: Automated OSINT gathering
2. **Vulnerability Analysis**: AI-powered assessment
3. **Exploitation**: Guided attack execution
4. **Reporting**: Professional documentation
5. **Remediation**: Prioritized recommendations

## ️ **LEGAL & NOTICE**

This framework is designed **EXCLUSIVELY** for:
- Authorized
- Security research and education
- exercises with explicit permission
- Security awareness training
- Vulnerability assessment with consent

**PROHIBITED USES:**
- Unauthorized access to systems
- Malicious attacks or cybercrime
- Data theft or privacy violations
- Any illegal or unethical activities

## **TROUBLESHOOTING**

### Common Issues & Solutions

** Port Already in Use**
```bash
# Change port in .env file
sed -i 's/PORT=9080/PORT=9081/' .env
```

** LLM Connection Issues**
```bash
# Check Ollama status
ollama list
ollama pull llama3.2:latest

# Test API keys
curl -H "Authorization: Bearer $GROQ_API_KEY" https/api.groq.com/openai/v1/models
```

** Missing Dependencies**
```bash
# Reinstall all dependencies
npm install
pip3 install -r requirements.txt

# Update repositories
node scripts/clone-repositories.js
```

** Permission Issues**
```bash
# Fix script permissions
find . -name "*.sh" -exec chmod +x {} \;
chmod +x launch.sh
```

## **PERFORMANCE OPTIMIZATION**

### System Requirements
- **OS**: Ubuntu 20.04+, Kali Linux, or Debian
- **RAM**: 8GB+ (16GB recommended for full AI features)
- **CPU**: 4+ cores (8+ recommended for concurrent operations)
- **Storage**: 50GB+ free space
- **Network**: Stable internet for API calls

### Optimization Tips
```bash
# Enable high-performance mode
echo 'performance' | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# Increase file limits for C2 operations
echo '* soft nofile 65536' | sudo tee -a /etc/security/limits.conf
echo '* hard nofile 65536' | sudo tee -a /etc/security/limits.conf

# Optimize network settings
echo 'net.core.somaxconn = 65535' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## **LEARNING RESOURCES**

### Framework Documentation
- **User Guide**: `/docs/user-guide.md`
- **API Reference**: `/docs/api-reference.md`
- **AI Integration**: `/docs/ai-monitoring.md`
- ️ **Development**: `/docs/development.md`

### External Resources
- **MITRE ATT&CK**: https/attack.mitre.org/
- **OWASP Testing Guide**: https/owasp.org/www-project-web-security-testing-guide/
- **NIST Cybersecurity Framework**: https/www.nist.gov/cyberframework
- **SANS **: https/www.sans.org/cyber-aces/

## **CONTRIBUTING**

We welcome contributions from the security community:

1. **Fork** the repository
2. **Create** a feature branch
3. **Test** thoroughly with AI monitoring
4. **Submit** a pull request with detailed description
5. **Follow** responsible disclosure principles

## **SUPPORT**

- **Email**: security-framework@proton.me
- **Discord**: https/discord.gg/security-research
- **Wiki**: https/github.com/security-framework/wiki
- **Issues**: https/github.com/security-framework/issues

---

## **PROJECT STATUS**

```
 FULLY OPERATIONAL
├── Core Framework: 100% Complete
├── AI Integration: 100% Complete
├── Repository Merge: 6/6 Frameworks
├── Web Dashboard: 100% Functional
├── Security Logging: 100% Active
├── API Endpoints: 100% Implemented
└── Documentation: 100% Complete

 Ready for Production Use
 All Systems Operational
 AI Monitoring Active
 Security Compliance: Full
```

**Built with ️ for the hacking community**

---

*This framework represents the culmination of modern operations, artificial intelligence, and responsible security research. Use it wisely, use it ethically, and advance the state of cybersecurity defense.*
