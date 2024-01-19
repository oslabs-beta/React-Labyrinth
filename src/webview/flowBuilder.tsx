import { ConnectionLineType, Edge, Node } from 'reactflow';
import { Tree } from '../types/tree';
import { getNonce } from '../getNonce';
import * as d3 from 'd3'

// Contructs our family tree for React application root file that was selected

class FlowBuilder {

  public mappedData (data: Tree, nodes: Node[], edges: Edge[]) : void {

    // Create a holder for the heirarchical data (msg.value), data comes in an object of all the Trees
    const root : d3.HierarchyNode<Tree> = d3.hierarchy(data)

    // Dynamically adjust height and width of display depending on the amount of nodes
    const totalNodes : number = root.descendants().length;
    const width : number = Math.max(totalNodes * 100, 800);
    const height = Math.max(totalNodes * 20, 500)
 

    //create tree layout and give nodes their positions and 
    const treeLayout : d3.TreeLayout<unknown> = d3.tree()
      .size([ width, height ])
      .separation((a: d3.HierarchyPointNode<Node>, b: d3.HierarchyPointNode<Node>) => (a.parent == b.parent ? 2 : 2.5))


    treeLayout(root);
    // Iterate through each Tree and create a node
    root.each((node: any) : void => {
  
      // Create a Node from the current Root and add it to our nodes array
      nodes.push({
        id: node.data.id,
        position: { x: node.x ? node.x : 0, y: node.y ? node.y : 0 },
        type: 'default',
        data: { label: node.data.name },
        style: {
          borderRadius: '6px',
          borderWidth: '2px',
          borderColor: '#6b7280',
          display: 'flex',
          justifyContent: 'center',
          placeItems: 'center',
          backgroundColor: `${(node.data.isClientComponent) ? '#fdba74' : '#93C5FD'}`,
        }
      });
      
      // If the current node has a parent, create an edge to show relationship
      if (node.data.parent) {
        const newEdge : Edge = {
          id: `${getNonce()}`,
          source: node.data.parent,
          target: node.data.id,
          type: ConnectionLineType.Bezier,
          animated: true,
        };

        
        // Check if the edge already exists before adding
        const edgeExists : boolean = edges.some(
          edge => edge.source === newEdge.source && edge.target === newEdge.target
        );
        
        // If edge does not exist, add to our edges array
        if (!edgeExists) {
          edges.push(newEdge)
        }
      }
    }
    )
  
  }
}

export default FlowBuilder;