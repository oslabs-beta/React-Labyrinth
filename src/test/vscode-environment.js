const { TestEnvironment } = require('jest-environment-node');
const vscode = require('vscode');

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