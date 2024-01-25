const path = require('path');

module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    preset: "ts-jest/presets/default-esm",
    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
    moduleNameMapper: {
        vscode: path.join(__dirname, 'src', 'test', 'vscode.js')
    },
    testMatch: ['**/test/**/*.js', '**/?(*.)+(spec|test).js'],
    modulePathIgnorePatterns: ["node_modules"]
};