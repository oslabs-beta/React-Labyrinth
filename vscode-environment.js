const { TestEnvironment } = require('jest-environment-node');
const vscode = require('vscode');

class VsCodeEnvironment extends TestEnvironment {
    async setup() {
        await super.setup();
        this.global.vscode = vscode;
    }

    async teardown() {
        this.global.vscode = {};
        await super.teardown();
    }

    // runScript(script) {
    //     return super.runScript(script);
    // }
}

module.exports = VsCodeEnvironment;