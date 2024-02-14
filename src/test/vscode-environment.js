const { TestEnvironment } = require('jest-environment-jsdom');
const vscode = require('@vscode/test-electron');

// Allows for VSCode Envionrment to be extended to Jest Environment 
class VsCodeEnvironment extends TestEnvironment {
    async setup() {
        await super.setup();
        this.global.vscode = vscode;
    }

    async teardown() {
        this.global.vscode = {};
        await super.teardown();
    }
}

module.exports = VsCodeEnvironment;