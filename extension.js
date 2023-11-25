const vscode = require('vscode');
const { createPanel } = require('./src/panel');
const { grabFile } = require('./src/parser');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

function activate(context) {

	let disposable = vscode.commands.registerCommand('react-labyrinth.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from React Labyrinth!');
	});

	// pass in the command we want to register (refer to package.json)
	let result = vscode.commands.registerCommand('myExtension.showPanel', () => {
		// call helper func
		createPanel(context);
	});

	vscode.commands.registerCommand('myExtension.pickFile', () => {
		grabFile();
	});

	context.subscriptions.push(disposable, result);
}

// This method is called when your extension is deactivated
// function deactivate() {}

module.exports = {
	activate,
	// deactivate
}
