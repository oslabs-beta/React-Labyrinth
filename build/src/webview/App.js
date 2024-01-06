"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Flow_1 = __importDefault(require("./Flow"));
require("./style.css");
function App() {
    return (react_1.default.createElement("div", { className: "App" },
        react_1.default.createElement(Flow_1.default, null)));
}
exports.default = App;
//# sourceMappingURL=App.js.map