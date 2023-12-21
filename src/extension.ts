import * as vscode from 'vscode';
import {createPanel} from './panel';
// const { createPanel } = require('./src/panel');
// const { Parser } = require('./src/parser');
import { Parser } from './parser';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('react-labyrinth.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from React Labyrinth!');
	});

	// pass in the command we want to register (refer to package.json)
	// let result = vscode.commands.registerCommand('myExtension.showPanel', () => {
	// 	// call helper func
	// 	createPanel(context);
	// });

	vscode.commands.registerCommand('myExtension.pickFile', async () => {
		const fileArray = await vscode.window.showOpenDialog({ canSelectFolders: false, canSelectFiles: true, canSelectMany: false });
		
		if (!fileArray || fileArray.length === 0) {
			vscode.window.showErrorMessage('No file selected');
			return;
		}
	
		const tree = new Parser(fileArray[0].path);
		tree.parse();
		const data = tree.getTree();
		console.log('Data sent back: \n', data);
		createPanel(context, data);
	});
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
