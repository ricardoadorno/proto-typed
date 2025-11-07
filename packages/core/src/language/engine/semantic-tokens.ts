import type {
  SemanticTokens,
  SemanticTokensLegend,
  SemanticTokensParams,
} from 'vscode-languageserver-protocol'

export const SEMANTIC_TOKENS_LEGEND: SemanticTokensLegend = {
  tokenTypes: [],
  tokenModifiers: [],
}

export function getSemanticTokens(
  _params: SemanticTokensParams
): SemanticTokens | null {
  return null
}
