document.addEventListener('DOMContentLoaded', function () {

  /* VARIABLES */
  var editMode = false;

  var cy = cytoscape({
    container: document.getElementById('graph-container'), // container to render in
    elements: [ // list of graph elements to start with
    ],
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'content': 'data(name)',
          'text-valign': 'center',
          'color': 'white',
          'text-outline-width': 2,
          'text-outline-color': '#000',
          'background-color': '#888'
        }
      },
      {
        selector: 'edge[label]',
        style: {
          'label': 'data(label)',
          'text-valign': 'center',
          'color': 'white',
          'text-outline-width': 2,
          'text-outline-color': '#000',
          'background-color': '#888',
          'width': 3,
          'line-color': '#51804D',
          'target-arrow-color': '#51804D',
          'target-arrow-shape': 'triangle'
        }
      }
    ],
    layout: {
      name: 'grid'
    }
  });

  console.log(cy);

  // Inputs
  const input_node_name = document.getElementById("input-node-id")
  const input_connection_name = document.getElementById("input-connection-name")
  var selected_node = null;
  /**
   * Add a node to the graph
   */
  document.getElementById("button-new-node").addEventListener('click', function () {
    const nodeName = input_node_name.value;
    // Check node name is provided
    if (nodeName.length < 1) {
      console.error("No node id provided");
      return;
    }

    // Get color for the node
    const color = document.getElementById("input-node-color").value;

    // Create the node object
    let itemsToAdd = [];
    // Create random x and y to add the node
    const x = Math.floor(Math.random() * (300 - 200)) + 200;
    const y = Math.floor(Math.random() * (300 - 200)) + 200;
    // Node object to add
    let newNode = {
      group: 'nodes',
      data: {
        name: nodeName
      },
      position: {
        x: x,
        y: y
      },
      style: {
        'background-color': color
      }
    };
    itemsToAdd.push(newNode);

    console.log("Add node: " + nodeName);

    // Add the items to the graph
    let eles = cy.add(itemsToAdd);
    input_node_name.value = "";
  });

  document.getElementById('button-add-connection').addEventListener('click', function () {
    // If on editMode add the connections to the selected node
    if (!editMode) {
      editMode = true;
    }
  });

  /**
   * Download graph as an image
   */
  document.getElementById("button-save-graph").addEventListener('click', function () {
    let png64 = cy.png();
    let blob = b64toBlob(png64, 'image/png');
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'graph.png';
    a.click();
  });

  document.getElementById("button-delete-node").addEventListener('click', function () {
    const nodeName = document.getElementById("input-node-id").value;
    if (cy.getElementById(nodeName)) {
      cy.remove(cy.getElementById(nodeName));
    }
  });

  /**
   * Asigna un listener a cada nodo para que se pueda editar
   */
  cy.addListener('tap', 'node', function (eles) {
    // Se asigna como seleccionado
    let node = eles.target._private;
    // If on edit mode
    if (editMode) {
      // Añadir a la lista
      addConnection(node, selected_node);
      editMode = false;
      return;
    }
    // if not on edit mode
    selected_node = node;
    // Show the selected node
    input_node_name.value = node.data.name;
  });

  function addConnection(target, source) {

    let itemsToAdd = [];
    let newEdge = {
      group: 'edges'
    };
    
    newEdge.data = {
      source: source.data.id,
      target: target.data.id,
      label: input_connection_name.value
    };
    itemsToAdd.push(newEdge);

    console.log("Add edge: " + source.data.name + " -> " + target.data.name);

    // Add the items to the graph
    let eles = cy.add(itemsToAdd);
  }
});

// https://stackoverflow.com/questions/27980612/converting-base64-to-blob-in-javascript
/**
 * Convert a base64 string to a Blob
 * @param {*} dataURI 
 * @returns blob
 */
function b64toBlob(dataURI) {

  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {
    type: 'image/png'
  });
}