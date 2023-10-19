const crypto = require('crypto');

class ConsistentHashing {
    constructor() {
        this.ring = new Map();
        this.sortedOrder = [];
    }

    /**
     * Adds a new node to the hash ring.
     *
     * @param {string} nodeId - Unique identifier for the node to be added.
     * @returns {string} The hash of the added node.
     *
     * @memberOf ConsistentHashing
     */
    addNode(nodeId) {
        let hashId = this.hashFunction(nodeId);

        this.ring.set(hashId, nodeId);
        this.sortedOrder.push(hashId);
        this.sortedOrder.sort((a, b) => a.localeCompare(b));

        return hashId;
    }

    /**
     * Removes a node from the hash ring by its nodeId.
     *
     * @param {string} nodeId - Unique identifier for the node to be removed.
     * @returns {boolean} True if the node was found and removed, false otherwise.
     *
     * @memberOf ConsistentHashing
     */
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

    /**
     * Retrieves the node responsible for the given key.
     *
     * @param {string} key - The key for which to find the responsible node.
     * @returns {string} The node responsible for handling the provided key.
     *
     * @memberOf ConsistentHashing
     */
    getNodeForKey(key) {
        if (this.ring.size === 0) {
            throw new Error('No nodes available in the ring');
        }

        const keyHash = this.hashFunction(key);

        for (const nodeHash of this.sortedOrder) {
            if (nodeHash.localeCompare(keyHash) >= 0) {
                return this.ring.get(nodeHash);
            }
        }

        // If we've gone through the entire ring and the keyHash is greater than any existing node hash,
        // we loop back to the first node in the ring (circular nature of the consistent hash ring)
        return this.ring.get(this.sortedOrder[0]);
    }

    /**
     * Generates a SHA-1 hash for the provided input.
     *
     * @param {string} input - The input for which to generate the hash.
     * @returns {string} The generated SHA-1 hash.
     *
     * @memberOf ConsistentHashing
     */
    hashFunction(input) {
        return crypto.createHash('sha1').update(input).digest('hex');
    }

    /**
     * Retrieves a list of all nodes in the hash ring.
     *
     * @returns {Array} An array of all nodes in the ring.
     *
     * @memberOf ConsistentHashing
     */
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