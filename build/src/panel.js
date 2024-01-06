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
exports.createPanel = void 0;
const vscode = __importStar(require("vscode"));
const getNonce_1 = require("./getNonce");
function createPanel(context, data) {
    // if the current panel exists, then reveal the column, else make one?
    // utilize method on vscode.window object to create webview
    const panel = vscode.window.createWebviewPanel('reactLabyrinth', 'React Labyrinth', 
    // create one new tab
    vscode.ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true
    });
    panel.iconPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'favicon.ico');
    const bundlePath = vscode.Uri.joinPath(context.extensionUri, 'build', 'bundle.js');
    // set webview URI to pass into html script
    const bundleURI = panel.webview.asWebviewUri(bundlePath);
    // render html of webview here
    panel.webview.html = createWebviewHTML(bundleURI, data);
    // will need to use onDidDispose to clear cached data and reset tree when the webview and/or application is closed
    panel.webview.onDidReceiveMessage((msg) => __awaiter(this, void 0, void 0, function* () {
        switch (msg.type) {
            case 'onData':
                if (!msg.value)
                    break;
                context.workspaceState.update('reactLabyrinth', msg.value);
                // console.log('msg.value from panel.js: ', msg.value);
                panel.webview.postMessage({
                    type: 'parsed-data',
                    value: msg.value, // tree object
                    settings: vscode.workspace.getConfiguration('reactLabyrinth')
                });
                break;
        }
    }), undefined, context.subscriptions);
}
exports.createPanel = createPanel;
;
// getNonce generates a new random string each time ext is used to prevent external injection of foreign code into the html 
const nonce = (0, getNonce_1.getNonce)();
// function to create the HTML page for webview
function createWebviewHTML(URI, initialData) {
    return (`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>React Labyrinth</title>
            </head>
            <body>
                <div id="root"></div>
                <script>
                    const vscode = acquireVsCodeApi();
                    window.onload = () => {
                        vscode.postMessage({
                            type: 'onData',
                            value: ${JSON.stringify(initialData)}
                        });
                    }
                </script>
                <script nonce=${nonce} src=${URI}></script>
            </body>
            </html>
        `);
}
//# sourceMappingURL=panel.js.map