import * as vscode from "vscode";
import { compile, DSL_LANGUAGE_ID } from "@proto-typed/core";
import type { Diag } from "@proto-typed/core";

export function registerDiagnostics(ctx: vscode.ExtensionContext) {
  const collection = vscode.languages.createDiagnosticCollection(DSL_LANGUAGE_ID);
  ctx.subscriptions.push(collection);

  const toVsDiag = (doc: vscode.TextDocument, diag: Diag) => {
    const start = doc.positionAt(diag.startOffset ?? 0);
    const end = doc.positionAt(diag.endOffset ?? (diag.startOffset ?? 0) + 1);
    const severity = vscode.DiagnosticSeverity.Error;
    const vsDiag = new vscode.Diagnostic(new vscode.Range(start, end), diag.message, severity);
    vsDiag.source = "proto-typed";
    if (diag.code) {
      vsDiag.code = diag.code;
    }
    return vsDiag;
  };

  async function refresh(doc: vscode.TextDocument) {
    if (doc.languageId !== DSL_LANGUAGE_ID) {
      return;
    }
    try {
      const { diagnostics } = await compile(doc.getText());
      collection.set(doc.uri, (diagnostics ?? []).map(d => toVsDiag(doc, d)));
    } catch (error) {
      console.error("Failed to refresh Proto-Typed diagnostics:", error);
    }
  }

  ctx.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(refresh),
    vscode.workspace.onDidChangeTextDocument(event => refresh(event.document))
  );

  vscode.workspace.textDocuments.forEach(refresh);

  return collection;
}
