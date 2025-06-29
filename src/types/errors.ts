export interface ChevrotainError {
  name: string;
  message: string;
  token?: {
    image: string;
    startLine?: number;
    startColumn?: number;
    endLine?: number;
    endColumn?: number;
  };
  context?: {
    ruleStack: string[];
    ruleOccurrenceStack: number[];
  };
  resyncedTokens?: any[];
}

export interface LexerError {
  offset: number;
  length: number;
  line: number;
  column: number;
  message: string;
}

export interface ParsedError {
  type: 'lexer' | 'parser' | 'unknown';
  title: string;
  message: string;
  location?: {
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
  };
  context?: {
    rule?: string;
    token?: string;
    expected?: string[];
  };
  suggestion?: string;
  code?: string;
}
