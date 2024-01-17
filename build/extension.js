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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const panel_1 = require("./panel");
const parser_1 = require("./parser");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    let disposable = vscode.commands.registerCommand('react-labyrinth.helloWorld', function () {
        vscode.window.showInformationMessage('Hello World from React Labyrinth!');
    });
    // pass in the command we want to register (refer to package.json)
    // let result = vscode.commands.registerCommand('myExtension.showPanel', () => {
    // 	// call helper func
    // 	createPanel(context);
    // });
    vscode.commands.registerCommand('myExtension.pickFile', () => __awaiter(this, void 0, void 0, function* () {
        const fileArray = yield vscode.window.showOpenDialog({ canSelectFolders: false, canSelectFiles: true, canSelectMany: false });
        if (!fileArray || fileArray.length === 0) {
            vscode.window.showErrorMessage('No file selected');
            return;
        }
        const tree = new parser_1.Parser(fileArray[0].path);
        tree.parse();
        const data = tree.getTree();
        console.log('Data sent back: \n', data);
        (0, panel_1.createPanel)(context, data);
    }));
    context.subscriptions.push(disposable);
}
// This method is called when your extension is deactivated
function deactivate() { }
module.exports = {
    activate,
    deactivate
};
//# sourceMappingURL=extension.js.map