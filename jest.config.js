module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Add other Jest configurations as needed
    testMatch: ['**/test/**/*.js', '**/?(*.)+(spec|test).js'], // Match JavaScript files
    moduleNameMapper: {
        '^@/(.*)$': 'build/src/$1', // Adjust this based on your project structure
    },
};
