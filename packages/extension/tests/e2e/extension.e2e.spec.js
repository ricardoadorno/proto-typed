"use strict";
/**
 * E2E Tests for Proto-Typed VS Code Extension
 * Tests hover, autocomplete, diagnostics, and webview functionality
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const test_electron_1 = require("@vscode/test-electron");
async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
        const extensionTestsPath = path.resolve(__dirname, './suite/index.js');
        const vscodeExecutablePath = await (0, test_electron_1.downloadAndUnzipVSCode)('stable');
        const [cliPath, ...args] = (0, test_electron_1.resolveCliArgsFromVSCodeExecutablePath)(vscodeExecutablePath);
        // Create test workspace
        const testWorkspace = path.resolve(extensionDevelopmentPath, 'test-workspace');
        // Make sure test workspace exists
        if (!fs.existsSync(testWorkspace)) {
            throw new Error(`Test workspace not found: ${testWorkspace}`);
        }
        console.log('🚀 Running VS Code Extension E2E Tests');
        console.log(`Extension path: ${extensionDevelopmentPath}`);
        console.log(`Test workspace: ${testWorkspace}`);
        // Run the extension tests
        await (0, test_electron_1.runTests)({
            vscodeExecutablePath,
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [testWorkspace, '--disable-extensions'],
        });
        console.log('✅ All E2E tests passed!');
    }
    catch (err) {
        console.error('❌ E2E tests failed:', err);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=extension.e2e.spec.js.map