const crypto = require('crypto');

class ConsistentHashing {
    constructor() {
        this.ring = new Map();
        this.sortedOrder = [];
    }

    addNode(nodeId) {
        let hashId = this.hashFunction(nodeId);

        this.ring.set(hashId, nodeId);
        this.sortedOrder.push(hashId);
        this.sortedOrder.sort((a, b) => a.localeCompare(b));

        return hashId;
    }

    removeNode(nodeId) {
        let foundNode = false;
        let nodeHash = null;

        for (const [hash, node] of this.ring) {
            if (node === nodeId) {
                foundNode = true;
                nodeHash = hash;
                break;
            }
        }

        if (!foundNode) {
            return false
        }
        
        this.ring.delete(nodeHash);
        const index = this.sortedOrder.indexOf(nodeHash);
        if (index !== -1) {
            this.sortedOrder.splice(index, 1);
        }

        return true;
    }

    getNodeForKey(key) {

    }

    hashFunction(input) {
        return crypto.createHash('sha1').update(input).digest('hex');
    }

    getNodes() {
        let nodes = [];

        for (const [hash, node] of this.ring) {
            nodes.push(node);
        }

        return nodes;
    }

    rebalance() {

    }
    
}

module.exports = ConsistentHashing;