import * as vscode from 'vscode';
import { getNonce } from './utils/getNonce';
import { Tree } from './types/tree';

let panel: vscode.WebviewPanel | undefined = undefined;

export function createPanel(context: vscode.ExtensionContext, data: Tree, columnToShowIn: vscode.ViewColumn) {
    // Utilize method on vscode.window object to create webview
    panel = vscode.window.createWebviewPanel(
        'reactLabyrinth',
        'React Labyrinth',
        // Create one tab
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );
    
    // Set the icon logo of extension webview
    panel.iconPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'RL(Final).png');
    
    // Set URI to be the path to bundle
    const bundlePath: vscode.Uri = vscode.Uri.joinPath(context.extensionUri, 'build', 'bundle.js');

    // Set webview URI to pass into html script
    const bundleURI: vscode.Uri = panel.webview.asWebviewUri(bundlePath);

    // Render html of webview here
    panel.webview.html = createWebviewHTML(bundleURI, data);

    // Sends data to Flow.tsx to be displayed after parsed data is received
    panel.webview.onDidReceiveMessage(
        async (msg: any) => {
            switch (msg.type) {
                case 'onData':
                    if (!msg.value) break;
                    context.workspaceState.update('reactLabyrinth', msg.value);
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

    return panel
};

// getNonce generates a new random string to prevent external injection of foreign code into the HTML
const nonce: string = getNonce();

// Creates the HTML page for webview
function createWebviewHTML(URI: vscode.Uri, initialData: Tree) : string {
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
    );
}
