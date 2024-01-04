import React, { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Panel,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowInstance
} from "reactflow";
import "reactflow/dist/style.css";
import { ConnectionLineType } from "../types/connection";
import FlowBuilder from './flowBuilder';
import * as d3 from 'd3';
import { Tree } from "../types/tree";
import { hierarchyData } from "../types/hierarchyData";

const onInit = (reactFlowInstance: ReactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const OverviewFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const initialNodes = [];
  const initialEdges = [];
  const elements = [];
  const edge = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.Bezier, animated: true }, eds)),
    []
  );

  useEffect(() => {
    window.addEventListener('message', (e) => {
      const msg = e.data; // object containing type prop and value prop
      switch (msg.type) {
        case 'parsed-data': {
          // const results = new FlowBuilder(msg.value);
          // results.build(msg.settings)
          let data : object | undefined = msg.value;
          console.log('data', data)
          // setNodes(results.initialNodes);
          // setEdges(results.initialEdges);
          
          // create a holder for the heirarchical data (msg.value), data comes in an object of all the Trees
          const root : any = d3.hierarchy(data)
          console.log('root', root)
          

          //create tree layout and give nodes their positions
          const treeLayout = d3.tree()
          treeLayout(root);
          
          root.each((node: any) : void => {
            // console.log('node name',Object.keys(node))
            elements.push({
              id: node.data.name,
              type: 'default',
              data: { label: node.data.name },
              position: { x: node.x || 0, y: node.y || 0 },
            });
            
            // figure out how to get edges to connect
            if (node.data.parent) {
              // elements.push(addEdge({ 
              //   id: node.data.id,
              //   source: node.data.id,
              //   target: node.data.parent,
              //   // sourceHandle: null,
              //   // targetHandle: null,
              // }))
            }
          })
          break;
        }
      }
    });

    setNodes(elements);
    
    //Rendering reactFlow
    if (reactFlowWrapper.current) {
      // Set initial position for the nodes
      const initialPosition = { x: 0, y: 0 };
      // reactFlowWrapper.current?.fitView(initialPosition);
    }
    // assign root variable using d3.heirarchy(data[0]), this will use d3 to format our data in a easy way to visualize the heirarchy
    // const elements: Tree[];

  }, []);

  return (
  <div style={{ height: '600px', width: '100%' }}>
    <ReactFlow
      nodes={nodes}
      // edges={edges}
      // nodes={elements}
      // edges={edge}
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
