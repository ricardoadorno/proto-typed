import * as vscode from 'vscode';
import { parseAndBuildAst, astToHtmlStringPreview } from '@proto-typed/core';
import { getWebviewContent } from './getWebviewContent';

export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  
  // Logo URI que será reutilizado
  const logoPath = vscode.Uri.joinPath(context.extensionUri, 'logo.svg');

  function updateWebview() {
    if (!currentPanel) {
      return;
    }

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const document = editor.document;
    const text = document.getText();
    
    // Converte o URI do logo para uso no webview
    const logoUri = currentPanel.webview.asWebviewUri(logoPath);

    try {
      const ast = parseAndBuildAst(text);
      const { html } = astToHtmlStringPreview(ast);
      currentPanel.webview.html = getWebviewContent(html, logoUri.toString());
    } catch (error) {
      console.error('Error parsing or rendering DSL:', error);
      currentPanel.webview.html = getWebviewContent('<p>Error rendering preview.</p>', logoUri.toString());
    }
  }

  let disposable = vscode.commands.registerCommand('proto-typed.showPreview', () => {
    const editor = vscode.window.activeTextEditor;
    
    // Abre o preview ao lado do editor ativo
    const viewColumn = editor 
      ? (editor.viewColumn || 0) + 1 
      : vscode.ViewColumn.Two;

    if (currentPanel) {
      currentPanel.reveal(viewColumn);
    } else {
      currentPanel = vscode.window.createWebviewPanel(
        'protoTypedPreview',
        'Proto-Typed Preview',
        viewColumn,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [context.extensionUri]
        }
      );

      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        null,
        context.subscriptions
      );

      vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.uri.toString() === vscode.window.activeTextEditor?.document.uri.toString()) {
          updateWebview();
        }
      });

      vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
          updateWebview();
        }
      });
    }
    updateWebview();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
