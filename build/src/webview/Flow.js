"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const reactflow_1 = __importStar(require("reactflow"));
require("reactflow/dist/style.css");
const connection_1 = require("../types/connection");
const flowBuilder_1 = __importDefault(require("./flowBuilder"));
const onInit = (reactFlowInstance) => console.log("flow loaded:", reactFlowInstance);
const OverviewFlow = () => {
    const initialNodes = [];
    const initialEdges = [];
    const [nodes, setNodes, onNodesChange] = (0, reactflow_1.useNodesState)(initialNodes);
    const [edges, setEdges, onEdgesChange] = (0, reactflow_1.useEdgesState)(initialEdges);
    const onConnect = (0, react_1.useCallback)((params) => setEdges((eds) => (0, reactflow_1.addEdge)(Object.assign(Object.assign({}, params), { type: connection_1.ConnectionLineType.Bezier, animated: true }), eds)), []);
    (0, react_1.useEffect)(() => {
        window.addEventListener('message', (e) => {
            const msg = e.data; // object containing type prop and value prop
            switch (msg.type) {
                case 'parsed-data': {
                    const results = new flowBuilder_1.default(msg.value);
                    results.build(msg.settings);
                    setNodes(results.initialNodes);
                    setEdges(results.initialEdges);
                    break;
                }
            }
        });
    }, []);
    return (react_1.default.createElement(reactflow_1.default, { nodes: nodes, edges: edges, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, onConnect: onConnect, onInit: onInit, fitView: true, attributionPosition: "top-right" },
        react_1.default.createElement(reactflow_1.MiniMap, { nodeStrokeColor: (n) => {
                var _a;
                if ((_a = n.style) === null || _a === void 0 ? void 0 : _a.backgroundColor)
                    return n.style.backgroundColor;
                if (n.type === "default")
                    return "#1a192b";
                return "#eee";
            }, nodeColor: (n) => {
                var _a;
                if ((_a = n.style) === null || _a === void 0 ? void 0 : _a.backgroundColor)
                    return n.style.backgroundColor;
                return "#fff";
            }, nodeBorderRadius: 2 }),
        react_1.default.createElement(reactflow_1.Panel, { position: "top-left" },
            react_1.default.createElement("div", { className: "text-black" },
                react_1.default.createElement("div", { className: "flex justify-end place-items-end shadow-lg bg-slate-50 w-20 h-15" },
                    react_1.default.createElement("p", { className: "pl-2 pr-2 py-2" },
                        "Client: ",
                        react_1.default.createElement("span", { className: "bg-orange text-transparent rounded-full" }, "00"))),
                react_1.default.createElement("div", { className: "flex justify-end place-items-end shadow-lg bg-slate-50 w-20 h-15" },
                    react_1.default.createElement("p", { className: "pl-2 pr-2 pb-2" },
                        "Server: ",
                        react_1.default.createElement("span", { className: "bg-blue text-transparent  rounded-full" }, "00"))))),
        react_1.default.createElement(reactflow_1.Controls, null),
        react_1.default.createElement(reactflow_1.Background, { color: "#aaa", gap: 16 })));
};
exports.default = OverviewFlow;
//# sourceMappingURL=Flow.js.map