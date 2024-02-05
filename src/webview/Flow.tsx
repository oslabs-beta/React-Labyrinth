import React, { useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Panel,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge
} from "reactflow";
import FlowBuilder from "./flowBuilder";
import { Tree } from "../types/tree";
import "reactflow/dist/style.css";
import "./style.css";

const OverviewFlow = () => {

  // Required to have different initial states to render through D3
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    window.addEventListener('message', (e: MessageEvent) => {
      // Object containing type prop and value prop
      const msg: MessageEvent = e;
      const flowBuilder = new FlowBuilder;

      switch (msg.data.type) {
        case 'parsed-data': {
          let data: Tree | undefined = msg.data.value;

          // Creates our Tree structure
          flowBuilder.mappedData(data, initialNodes, initialEdges);

          setEdges(initialEdges);
          setNodes(initialNodes);
          break;
        }
      }
    });
  }, []);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
