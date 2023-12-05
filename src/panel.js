const vscode = require('vscode');
const { getNonce } = require('./getNonce.js');
const { Parser } = require('./parser.js');

// let panel;

function createPanel(context) {
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
    panel.webview.html = createWebviewHTML(bundleURI);

    // will need to use onDidDispose to clear cached data and reset tree when the webview and/or application is closed

    // from my understadning, we will have to use onDidReceiveMessage to send message from the webview to and from the extension. its sent and read based on the switch case 'string' and then activates their functionality there

    // we will need to grab the value of the root file path => then make new instance of parser => call parse method on new instance => then create a func to then post a message to our flow.jsx

    // panel.webview.onDidReceiveMessage(
    //     async (msg) => {
    //         console.log('Message: ', msg)
    //         switch (msg.type) {
    //             case 'test':
    //                 console.log('testing onDidReceiveMessage');

    //                 break;
    //         }
    //     },
    //     null,
    //     vscode.Disposable
    // );
}

// getNonce generates a new random string each time ext is used to prevent external injection of foreign code into the html 
const nonce = getNonce();

// function to update state in webview

// function to create the HTML page for webview
function createWebviewHTML(URI) {
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
                        console.log('VsCode: ', vscode)
                        vscode.postMessage({command: 'startup'})
                    }
                </script>
                <script nonce=${nonce} src=${URI}></script>
            </body>
            </html>
        `
    )
}

module.exports = { createPanel };