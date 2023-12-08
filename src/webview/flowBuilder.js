import React from 'react';
// will create a build func and then call the helper funcs to return an object
// make a new instance of this class in flow, call the build method, and pass this as state
class FlowBuilder {
  constructor(data) {
    this.parsedData = [data];
    this.id = 0;
    this.initialNodes = [];
    this.viewData;
    this.edgeId = 0;
    this.initialEdges = [];
  }

  buildNodesArray(parsedData) {
    if (!parsedData) return;

    parsedData.forEach((item) => {
      const node = {
        id: (++this.id).toString(),
        data: {
          label: (
            <div key={this.id}>
              <ul>
                <li>{item.fileName}</li>
                <li>Client Component: {item.isClientComponent.toString()}</li>
              </ul>
            </div>
          )
        },
        type: item.depth === 0 ? 'input' : '',
        position: { x: 0, y: 0 },
        style: {
          backgroundColor: "var(--vscode-dropdown-background)",
          borderRadius: "15px",
          width: '265px',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          border: 'none',
          padding: '10px 10px 3px 10px'
        },
      };
      this.initialNodes.push(node);
      if (item.children) {
        this.buildNodesArray(item.children);
      }
    });
    // console.log('initialNodes', this.initialNodes);
  };

  buildEdgesArray(parsedData, parentID) {
    if (!parsedData) return;

    parsedData.forEach((item) => {
      const nodeID = ++this.edgeId;
      if (parentID) {
        const edge = {
          id: `e${parentID}-${nodeID}`,
          source: parentID.toString(),
          target: nodeID.toString(),
          type: 'bezier',
          animated: false,
        };
        this.initialEdges.push(edge);
      }
      if (item.children) {
        this.buildEdgesArray(item.children, nodeID);
      }
    });
    // console.log('initialEdges', this.initialEdges);
  }

  build(settings) {
    const treeParsed = JSON.parse(JSON.stringify(this.parsedData[0]));
    console.log('settings: ', settings);
    const traverse = (node) => {
      let validChildren = [];

      for (let i = 0; i < node.children.length; i++) {
        if (
          node.children[i].thirdParty &&
          settings.thirdParty &&
          !node.children[i].reactRouter
        ) {
          validChildren.push(node.children[i]);
        } else if (node.children[i].reactRouter && settings.reactRouter) {
          validChildren.push(node.children[i]);
        } else if (
          !node.children[i].thirdParty &&
          !node.children[i].reactRouter
        ) {
          validChildren.push(node.children[i]);
        }
      }

      // Update children with only valid nodes, and recurse through each node
      node.children = validChildren;
      node.children.forEach((child) => {
        traverse(child);
      });
    }
    traverse(treeParsed);
    // Update the vewData state
    this.viewData = ([treeParsed]);
    console.log('viewData:', this.viewData);
    this.buildNodesArray(this.viewData);
    this.buildEdgesArray(this.viewData);
  }
}

export default FlowBuilder;