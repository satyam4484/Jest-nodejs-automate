module.exports = {
    testEnvironment: "node",
    testMatch: [
        "**/tests/**/*.test.js", // all tests inside __tests__ folders
        "**/?(*.)+(spec|test).js"   // or files ending with .spec.js / .test.js
    ],

    // Coverage settings
    collectCoverage: true,
    collectCoverageFrom: [
        "app.js",              // cover main app file
        // "server.js",           // cover server entry point
        "routes/**/*.js",      // cover everything inside routes folder
        "controllers/**/*.js", // cover all controllers
        "services/**/*.js"     // cover services (if you have them)
    ],

    coverageDirectory: "coverage",

    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },

    testPathIgnorePatterns: ["/node_modules/", "/coverage/"]
};
