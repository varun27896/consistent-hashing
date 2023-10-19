const ConsistentHashing = require('./consistentHashing');

const consistentHashing = new ConsistentHashing();

const numberOfNodes = 5;


for (let i = 1; i <= numberOfNodes; i++) {
    consistentHashing.addNode("node" + i);
}

consistentHashing.removeNode("node1");