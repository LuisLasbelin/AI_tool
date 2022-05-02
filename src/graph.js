
document.addEventListener('DOMContentLoaded', function() {

    var cy = cytoscape({
        container: document.getElementById('graph-container'), // container to render in
          elements: [ // list of graph elements to start with
          ],
          style: [ // the stylesheet for the graph
            {
              selector: 'node',
              style: {
                'label': 'data(id)',
                'color': '#fff',
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 3,
                'line-color': '#51804D',
                'target-arrow-color': '#51804D',
                'target-arrow-shape': 'triangle'
              }
            }
          ],
          layout: {
            name: 'grid',
            rows: 1
          }
    });

    console.log(cy);

    const btn = document.getElementById("button-new-node");
    btn.addEventListener('click', function() {
        const nodeId = document.getElementById("input-node-id").value;
        // Check node name is provided
        if(nodeId.length < 1) {
            console.error("No node id provided");
            return;
        }
        // If the node already exists, erase it
        if(cy.getElementById(nodeId)) {
            cy.remove(cy.getElementById(nodeId));
        }

        // Get connections if there are any
        const connections = document.getElementById("input-node-connections").value;
        // Get color for the node
        const color = document.getElementById("input-node-color").value;
        // Get the connections array input
        let connectionsArray = [];
        if(connections.length > 0) {
            connectionsArray = connections.split(";");
        }
        // Create the node object
        let itemsToAdd = [];
        // Create random x and y to add the node
        const x = Math.floor(Math.random() * (500 - 0)) + 0;
        const y = Math.floor(Math.random() * (500 - 0)) + 0;
        // Node object to add
        let newNode = {
            group: 'nodes',
            data: { id: nodeId },
            position: { x: x, y: y },
            style: { 'background-color':  color}
        };
        itemsToAdd.push(newNode);

        console.log("Add node: " + nodeId);

        // Add connections
        for (let i = 0; i < connectionsArray.length; i++) {
            // Check if the connection in connectionsArray is contained in the graph
            if(cy.getElementById(connectionsArray[i])) {
                let newEdge = {
                    group: 'edges'
                };
                newEdge.data = {source: nodeId, target: connectionsArray[i] }; 
                itemsToAdd.push(newEdge);

                console.log("Add edge: " + nodeId + " -> " + connectionsArray[i]);
            }
        }
        // Add the items to the graph
        let eles = cy.add(itemsToAdd);
    });
});
