import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Panel,
  Controls,
  Background,
  useNodesState,
  useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";
import { ConnectionLineType } from "../types/connection";
import FlowBuilder from './flowBuilder';

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const OverviewFlow: React.FC = () => {
  const initialNodes = [];
  const initialEdges = [];

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
          const results = new FlowBuilder(msg.value);
          results.build(msg.settings)
          setNodes(results.initialNodes);
          setEdges(results.initialEdges);
          break;
        }
      }
    });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      fitView
      attributionPosition="top-right"
    >
      <MiniMap
        nodeStrokeColor={(n): string => {
          if (n.style?.background) return `${n.style.background}`;
          if (n.data.label.props.className.includes('orange')) return "#fdba74";
          if (n.data.label.props.className.includes('blue')) return "#93C5FD";
          if (n.type === "default") return "#1a192b";

          return "#eee";
        }}
        nodeColor={(n): string => {
          if (n.style?.background) return `${n.style.background}`;
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
  );
};

export default OverviewFlow;
