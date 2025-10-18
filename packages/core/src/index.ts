import { tokenize as internalTokenize } from "../../../src/core/lexer/lexer";
import { parseAndBuildAst } from "../../../src/core/parser/parse-and-build-ast";
import { astToHtmlStringPreview } from "../../../src/core/renderer/ast-to-html-string-preview";
import { astToHtmlDocument } from "../../../src/core/renderer/ast-to-html-document";
import { routeManagerGateway } from "../../../src/core/renderer/infrastructure/route-manager-gateway";
import { ErrorBus } from "../../../src/core/error-bus";
import { availableThemes } from "../../../src/core/themes/theme-definitions";
import { DSL_LANGUAGE_ID, DSL_TOKEN_TYPES } from "../../../src/core/editor/constants";
import type { ProtoError } from "../../../src/types/errors";
import type { AstNode } from "../../../src/types/ast-node";
import type { RenderOptions } from "../../../src/types/render";
import type { RouteMetadata } from "../../../src/types/routing";

export const tokenize = internalTokenize;

export {
  parseAndBuildAst,
  astToHtmlStringPreview,
  astToHtmlDocument,
  routeManagerGateway,
  ErrorBus,
  availableThemes,
  DSL_LANGUAGE_ID,
  DSL_TOKEN_TYPES
};

export {
  ERROR_CODES,
  sanitizeErrorMessage
} from "../../../src/types/errors";

export type { ProtoError, AstNode, RenderOptions, RouteMetadata };

export type Diag = {
  message: string;
  code?: string;
  severity?: string;
  stage?: string;
  hint?: string;
  startOffset?: number;
  endOffset?: number;
};

export type CompileOptions = {
  standaloneHtml?: boolean;
  renderOptions?: RenderOptions;
};

export async function compile(text: string, opts: CompileOptions = {}) {
  const diagnostics: Diag[] = [];
  let html = "";

  const lineOffsets = computeLineOffsets(text);
  const textLength = text.length;

  try {
    const ast = parseAndBuildAst(text);
    const parseErrors: ProtoError[] = extractAndClearErrors(ast);
    diagnostics.push(...parseErrors.map(err => protoErrorToDiag(err, lineOffsets, textLength)));

    const renderResult = astToHtmlStringPreview(ast, opts.renderOptions);
    diagnostics.push(
      ...(renderResult.errors ?? []).map(err => protoErrorToDiag(err, lineOffsets, textLength))
    );

    html = opts.standaloneHtml
      ? astToHtmlDocument(ast, opts.renderOptions)
      : renderResult.html;
  } catch (error) {
    diagnostics.push({
      message: error instanceof Error ? error.message : String(error),
      stage: "compile"
    });
    html = "";
  }

  return { html, diagnostics };
}

export function extractAndClearErrors(ast: AstNode | AstNode[]) {
  const errors = ((ast as any).__errors ?? []) as ProtoError[];
  if ((ast as any).__errors) {
    delete (ast as any).__errors;
  }
  return errors;
}

export function protoErrorToDiag(error: ProtoError, lineOffsets: number[], textLength: number): Diag {
  const startOffset = positionToOffset(lineOffsets, error.line, error.column, textLength);
  const endOffset =
    startOffset !== undefined
      ? startOffset + Math.max(error.length ?? 1, 1)
      : undefined;

  return {
    message: error.message,
    code: error.code,
    severity: error.severity,
    stage: error.stage,
    hint: error.hint,
    startOffset,
    endOffset
  };
}

export function computeLineOffsets(text: string) {
  const offsets = [0];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === "\r") {
      if (text[i + 1] === "\n") {
        offsets.push(i + 2);
        i++;
      } else {
        offsets.push(i + 1);
      }
    } else if (char === "\n") {
      offsets.push(i + 1);
    }
  }
  return offsets;
}

function positionToOffset(
  lineOffsets: number[],
  line: number | undefined,
  column: number | undefined,
  textLength: number
) {
  if (!line || !column || line <= 0 || column <= 0) {
    return undefined;
  }
  if (line > lineOffsets.length) {
    return textLength;
  }
  const lineStart = lineOffsets[line - 1];
  if (lineStart === undefined) {
    return undefined;
  }
  return lineStart + (column - 1);
}
