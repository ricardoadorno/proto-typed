import * as vscode from 'vscode';
import { parseAndBuildAst, astToHtmlStringPreview } from '@proto-typed/core';
import { getWebviewContent } from './getWebviewContent';

export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

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

    try {
      const ast = parseAndBuildAst(text);
      const { html } = astToHtmlStringPreview(ast);
      currentPanel.webview.html = getWebviewContent(html);
    } catch (error) {
      console.error('Error parsing or rendering DSL:', error);
      currentPanel.webview.html = getWebviewContent('<p>Error rendering preview.</p>');
    }
  }

  let disposable = vscode.commands.registerCommand('proto-typed.showPreview', () => {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (currentPanel) {
      currentPanel.reveal(column);
    } else {
      currentPanel = vscode.window.createWebviewPanel(
        'protoTypedPreview',
        'Proto-Typed Preview',
        column || vscode.ViewColumn.One,
        {
          enableScripts: true,
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
