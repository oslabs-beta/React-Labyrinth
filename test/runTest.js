const path = require('path');
const { runTests } = require('@vscode/test-electron');

async function main() {
	try {
		console.log('inside try block');
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../');

		console.log('past first var');

		// The path to the extension test script
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		console.log('past secondvar');

		// Download VS Code, unzip it and run the integration test
		await runTests({ extensionDevelopmentPath, extensionTestsPath });
	} catch (error) {
		console.error('Failed to start testing: ', error);
		process.exit(1);
	};
}

main();
