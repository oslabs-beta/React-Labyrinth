// const vscode = require('vscode');
import * as vscode from 'vscode';
import { getNonce } from './getNonce';
import { Tree } from './types/tree';

export function createPanel(context: vscode.ExtensionContext, data: Tree) {
    // if the current panel exists, then reveal the column, else make one?

    // utilize method on vscode.window object to create webview
    const panel = vscode.window.createWebviewPanel(
        'reactLabyrinth',
        'React Labyrinth',
        // create one new tab
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.iconPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'favicon.ico');

    const bundlePath = vscode.Uri.joinPath(context.extensionUri, 'build', 'bundle.js');

    // set webview URI to pass into html script
    const bundleURI = panel.webview.asWebviewUri(bundlePath);

    // render html of webview here
    panel.webview.html = createWebviewHTML(bundleURI, data);

    // will need to use onDidDispose to clear cached data and reset tree when the webview and/or application is closed

    panel.webview.onDidReceiveMessage(
        async (msg: any) => {
            switch (msg.type) {
                case 'onData':
                    if (!msg.value) break;
                    context.workspaceState.update('reactLabyrinth', msg.value);
                    // console.log('msg.value from panel.js: ', msg.value);
                    panel.webview.postMessage(
                        {
                            type: 'parsed-data',
                            value: msg.value, // tree object
                            settings: vscode.workspace.getConfiguration('reactLabyrinth')
                        });
                    break;

            }
        },
        undefined,
        context.subscriptions
    );
};

// getNonce generates a new random string each time ext is used to prevent external injection of foreign code into the html 
const nonce = getNonce();

// function to create the HTML page for webview
function createWebviewHTML(URI: vscode.Uri, initialData: Tree) {
    return (
        `
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
        `
    )
}

// module.exports = { createPanel };