import React, { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Panel,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
  Node,
  Edge
} from "reactflow";
import "reactflow/dist/style.css";
import { ConnectionLineType } from "../types/connection";
import FlowBuilder from './flowBuilder';
import * as d3 from 'd3';
import { Tree } from "../types/tree";
import { hierarchyData } from "../types/hierarchyData";
import { getNonce } from "../getNonce";
import { FlowNode } from "typescript";

const onInit = (reactFlowInstance: ReactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const OverviewFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const initialNodes : Node[] = [];
  const initialEdges : Edge[] = [];
 
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.Bezier, animated: true }, eds)),
    []
  );


  useEffect(() => {
    window.addEventListener('message', (e: MessageEvent) => {
      // object containing type prop and value prop
      const msg : MessageEvent = e; 
      console.log(e)

      switch (msg.data.type) {
        case 'parsed-data': {
          let data : Tree | undefined = msg.data.value;
          mappedData(data)
          setEdges(initialEdges);
          setNodes(initialNodes)
          break;
        }
      }
    });
  }, []);


  // Function that creates Tree Structure 
  function mappedData (data: Tree) : void {

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
      console.log('Node', node)
      // Create a Node from the current Root and add it to our nodes array
      initialNodes.push({
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
        const edgeExists : boolean = initialEdges.some(
          edge => edge.source === newEdge.source && edge.target === newEdge.target
        );
        
        // If edge does not exist, add to our edges array
        if (!edgeExists) {
          initialEdges.push(newEdge)
        }
      }
    }
    )
  
  }

  return (
  <div style={{ height: '600px', width: '100%' }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      fitView
      attributionPosition="top-right"
      style={{ width: '100%', height: '100%' }}
    >
      <MiniMap
        nodeStrokeColor={(n): string => {
          if (n.style?.backgroundColor) return n.style.backgroundColor;
          if (n.type === "default") return "#1a192b";

          return "#eee";
        }}
        nodeColor={(n): string => {
          if (n.style?.backgroundColor) return n.style.backgroundColor;
          return "#fff";
        }}
        nodeBorderRadius={2}
      />
      <Panel position="top-left">
        <div className="text-black">
          <div className="flex justify-end place-items-end shadow-lg bg-slate-50 w-20 h-15">
            <p className="pl-2 pr-2 py-2">Client: <span className="bg-orange text-transparent rounded-full">00</span></p>
          </div>
          <div className="flex justify-end place-items-end shadow-lg bg-slate-50 w-20 h-15">
            <p className="pl-2 pr-2 pb-2">Server: <span className="bg-blue text-transparent  rounded-full">00</span></p>
          </div>
        </div>
      </Panel >
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow >
  </div>
  );
};

export default OverviewFlow;
