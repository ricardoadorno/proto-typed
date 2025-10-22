export function getWebviewContent(html: string, logoUri?: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proto-Typed Preview</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        .preview-header {
            padding: 12px 20px;
            background: var(--vscode-editor-background);
            border-bottom: 1px solid var(--vscode-panel-border);
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .preview-logo {
            width: 24px;
            height: 24px;
        }
        .preview-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--vscode-foreground);
        }
        #root {
            padding: 20px;
            background: var(--vscode-editor-background);
            min-height: calc(100vh - 60px);
        }
    </style>
</head>
<body>
    <div class="preview-header">
        ${logoUri ? `<img src="${logoUri}" alt="Proto-Typed" class="preview-logo" />` : ''}
        <span class="preview-title">Proto-Typed Preview</span>
    </div>
    <div id="root">${html}</div>
</body>
</html>`;
}
