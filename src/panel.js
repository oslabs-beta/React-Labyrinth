const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const babel = require('@babel/parser');

function createPanel(context) {
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
}


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
                <script src=${URI}></script>
            </body>
            </html>
        `
    )
}

let ast;
async function grabFile() {

    const file = await vscode.window.showOpenDialog({canSelectFolders: true, canSelectFiles: true, canSelectMany: true})
        .then(data => {
            fs.readFile(data[0].path, 'utf-8', (err, data) => {
                console.log(typeof data)
                console.log(data)
            })
        })
}

module.exports = {createPanel, grabFile};