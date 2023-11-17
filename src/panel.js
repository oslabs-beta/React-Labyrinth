const vscode = require('vscode');

function createPanel() {
    // utilize method on vscode.window object to create webview
    const panel = vscode.window.createWebviewPanel(
        'reactLabyrinth',
        'React Labyrinth',
        // create one new tab
        vscode.ViewColumn.One,
        {}
    );

    // render html of webview here
    panel.webview.html = '<h1>Hello World!!!</h1>'
}

module.exports = {createPanel};