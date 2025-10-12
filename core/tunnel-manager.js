import ngrok from 'ngrok';
import { EventEmitter } from 'events';

export class TunnelManager extends EventEmitter {
    constructor() {
        super();
        this.tunnels = new Map();
        this.isActive = false;
    }

    async start() {
        this.isActive = true;
        this.emit('started');
    }

    async createTunnel(options) {
        const tunnelId = `tunnel_${Date.now()}`;
        const tunnel = {
            id: tunnelId,
            url: `https://mock-${tunnelId}.ngrok.io`,
            port: options.port || 8080,
            status: 'active',
            created: new Date().toISOString()
        };
        
        this.tunnels.set(tunnelId, tunnel);
        return tunnel;
    }

    async listTunnels() {
        return Array.from(this.tunnels.values());
    }

    async stop() {
        this.isActive = false;
        this.tunnels.clear();
        this.emit('stopped');
    }
}
