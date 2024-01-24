import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
	console.log('made it through the line before try block');
	try {
		console.log('inside try block');
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		console.log('inside try block after first var declare');

		// The path to the extension test script
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		console.log('inside try block after second var declare');

		// Download VS Code, unzip it and run the integration test
		await runTests({ 
			version: "1.85.1", 
			extensionDevelopmentPath, 
			extensionTestsPath
		});
	} catch (err) {
		console.error('Failed to run tests', err);
		process.exit(1);
	}
}

main();
