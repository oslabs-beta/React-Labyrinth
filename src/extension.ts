import * as vscode from 'vscode';
import {createPanel} from './panel';
import { Parser } from './parser';
import { Tree } from './types/tree';
import { showNotification } from './utils/modal';

let tree: Parser | undefined = undefined;
let panel: vscode.WebviewPanel | undefined = undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context: vscode.ExtensionContext) {

	// This is the column where Webview will be revealed to
	let columnToShowIn : vscode.ViewColumn | undefined = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;
	
	// Command that allows for User to select the root file of their React application.
	const pickFile: vscode.Disposable = vscode.commands.registerCommand('myExtension.pickFile', async () => {
		// Check if there is an existing webview panel, if so display it.
		if (panel) {
			panel.reveal(columnToShowIn);
		}

		// Opens window for the User to select the root file of React application
		const fileArray: vscode.Uri[] = await vscode.window.showOpenDialog({ canSelectFolders: false, canSelectFiles: true, canSelectMany: false });

		// Throw error message if no file was selected
		if (!fileArray || fileArray.length === 0) {
			showNotification({message: 'No file selected'});
			return;
		}

		// Create Tree to be inserted into returned HTML
		tree = new Parser(fileArray[0].path);
		tree.parse();
		const data: Tree = tree.getTree();

		// Check if panel currently has a webview, if it does dispose of it and create another with updated root file selected. 
		// Otherwise create a new webview to display root file selected.
		if (!panel) {
			panel = createPanel(context, data, columnToShowIn);
		} else {
			panel.dispose()
			panel = createPanel(context, data, columnToShowIn);
		}

		// Listens for when webview is closed and disposes of webview resources
		panel.onDidDispose(
			() => {
				panel.dispose();
				panel = undefined;
				columnToShowIn = undefined;
			},
			null,
			context.subscriptions
		);
	});

	// Command to show panel if it is hidden
	const showPanel: vscode.Disposable = vscode.commands.registerCommand('myExtension.showPanel', () => {
		panel.reveal(columnToShowIn);
	});

	context.subscriptions.push(pickFile, showPanel);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
