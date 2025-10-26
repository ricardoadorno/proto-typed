# Proto-Typed VSCode Extension

VSCode extension for syntax highlighting and preview of the Proto-Typed DSL (`.pty`) language.

## 🚀 Development

### Prerequisites

```bash
pnpm install
```

### Compile

```bash
# In the project root
pnpm run compile

# Or directly in this folder
cd packages/extension
pnpm run compile
```

### Run in development mode

1. Open the **project root folder** in VSCode
2. Press `F5` (or Run > Start Debugging)
3. A new VSCode window will open with the extension loaded
4. In that window, open a `.pty` file (e.g., `example.pty`)
5. Click the preview icon in the upper right corner 📄
6. The Proto-Typed logo will appear in the preview header

### Features

- ✅ **Syntax Highlighting**: Automatic colors for keywords, strings, comments in `.pty` files
- ✅ **File Icon**: Proto-Typed logo for `.pty` files
- ✅ **Real-time Preview**: Button in the upper right corner opens HTML preview
- ✅ **Logo in preview**: Visual header with Proto-Typed logo
- ✅ **Snippets**: Autocomplete for common structures (screen, button, etc.)
- ✅ **Validation**: Parsing errors shown in the preview

### Structure

```
packages/extension/
├── src/
│   ├── extension.ts          # Main extension code
│   └── getWebviewContent.ts  # HTML template for the preview
├── syntaxes/
│   └── proto-typed.tmLanguage.json  # Syntax highlighting rules
├── snippets/
│   └── snippets.json         # Code snippets
├── dist/                     # Compiled files (generated)
├── logo.svg                 # Proto-Typed logo
├── example.pty              # Example file for testing
└── TESTING.md               # Detailed testing guide

```

## 📝 Available commands

- **Proto-Typed: Open Preview to the Side**: Opens a preview next to the current editor
  - Shortcut: Click the 📄 icon in the upper right corner
  - Or: `Ctrl+Shift+P` > "Proto-Typed: Open Preview to the Side"

## 🐛 Troubleshooting

### Command not found

```bash
# Compile the extension
pnpm run compile
# Then press F5
```

### Preview does not update

- Save the `.ptd` file
- Or close and reopen the preview

### Code changes do not appear

1. Recompile: `pnpm run compile`
2. In the development window: `Ctrl+R` (or `Cmd+R`)
3. Or: `Ctrl+Shift+P` > "Developer: Reload Window"

### Error when activating the extension

Make sure that:

1. The `@proto-typed/core` package is compiled: `cd ../core && pnpm run build`
2. The extension is compiled: `pnpm run compile`
3. The dependencies are installed: `pnpm install` (in the root)

## 📦 Build for production

To create an installable `.vsix` package:

```bash
# Install the packager (if necessary)
pnpm add -D @vscode/vsce

# Create the package
npx @vscode/vsce package
```

This will create a `proto-typed-vscode-0.0.1.vsix` file that can be installed in any VSCode.
