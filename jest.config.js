const path = require('path');

// module.exports = {
//     preset: 'ts-jest',
//     testEnvironment: './vscode-environment.js',
//     modulePaths: ['<rootDir>'],
//     // Add other Jest configurations as needed
//     // testMatch: ['**/test/**/*.js', '**/?(*.)+(spec|test).js'], // Match JavaScript files
//     moduleNameMapper: {
//         // '^@/(.*)$': 'build/src/$1', // Adjust this based on your project structure
//         vscode: path.join(__dirname, 'vscode.js')  // <----- most important line
//     },
// };

module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    preset: "ts-jest/presets/default-esm", // or other ESM presets
    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
    moduleNameMapper: {
        // '^@/(.*)$': 'build/src/$1',
        vscode: path.join(__dirname, 'vscode.js')  // <----- most important line
    },
    testMatch: ['**/test/**/*.js', '**/?(*.)+(spec|test).js']
};