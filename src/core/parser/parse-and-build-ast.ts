import { tokenize } from '../lexer/lexer';
import { parser } from './parser';
import { createAstBuilder } from './ast-builder';
import { generateDeterministicIds } from '../utils/deterministic-ids';
import type { ProtoError } from '../../types/errors';
import { ERROR_CODES } from '../../types/errors';

/**
 * Parse input text into a Concrete Syntax Tree (CST) and then outputs an Abstract Syntax Tree (AST).
 * 
 * Now with error recovery: returns partial AST + collected errors instead of throwing.
 * 
 * @param text The DSL text to parse
 * @param previousAst Optional previous AST for ID reuse (for better stability between parses)
 * @returns The Abstract Syntax Tree with deterministic IDs and collected errors
 */
export function parseAndBuildAst(text: string, previousAst?: any) {
    const collectedErrors: ProtoError[] = [];

    // ========================================================
    // LEXER PHASE: Tokenize with error collection
    // ========================================================
    const lexResult = tokenize(text);

    // Collect lexer errors
    if (lexResult.errors.length > 0) {
        lexResult.errors.forEach((lexError) => {
            // Extract character from error message
            const charMatch = lexError.message.match(/unexpected character: ->\{?(.)\}?<-/);
            const char = charMatch ? charMatch[1] : 'unknown';
            
            const error: ProtoError = {
                stage: 'lexer',
                severity: 'error',
                code: ERROR_CODES.LEX_INVALID_TOKEN,
                message: `Unexpected character '${char}' - not a valid DSL token`,
                line: lexError.line,
                column: lexError.column,
                length: lexError.length,
            };
            collectedErrors.push(error);
        });
    }

    // ========================================================
    // PARSER PHASE: Parse with error recovery
    // ========================================================
    parser.input = lexResult.tokens;
    const cst = parser.program();

    // Collect parser errors (but don't throw - enable error recovery)
    if (parser.errors.length > 0) {
        parser.errors.forEach((parseError) => {
            const token = parseError.token;
            
            // Skip redundant parser errors that just report lexer errors
            // (we already collected lexer errors above)
            if (parseError.message.includes('Lexer errors detected:')) {
                return; // Skip this redundant error
            }
            
            const error: ProtoError = {
                stage: 'parser',
                severity: 'error',
                code: ERROR_CODES.PARSE_SYNTAX_ERROR,
                message: parseError.message,
                line: token?.startLine || 1,
                column: token?.startColumn || 1,
                unexpected: token?.image,
                expected: parseError.context?.ruleStack,
            };
            collectedErrors.push(error);
        });
    }

    // ========================================================
    // AST BUILDING PHASE: Convert CST to AST with error collection
    // ========================================================
    const builder = createAstBuilder(parser);
    let ast;

    try {
        // Attach error collection array to builder instance BEFORE visit
        // The builder methods will populate this array during AST construction
        (builder as any).__builderErrors = [];
        
        ast = builder.visit(cst);
    } catch (buildError: unknown) {
        // If AST building fails completely, create minimal AST
        const error: ProtoError = {
            stage: 'builder',
            severity: 'fatal',
            code: ERROR_CODES.BLD_INVALID_PROPS,
            message: buildError instanceof Error ? buildError.message : String(buildError),
            line: 1,
            column: 1,
        };
        collectedErrors.push(error);
        
        // Return minimal valid AST structure
        ast = { nodes: [] };
    }

    // Collect builder errors from the builder instance
    const builderErrors = (builder as any).__builderErrors || [];
    if (builderErrors.length > 0) {
        collectedErrors.push(...builderErrors);
    }

    // ========================================================
    // ID GENERATION: Generate deterministic IDs
    // ========================================================
    const astWithIds = generateDeterministicIds(ast, previousAst);

    // ========================================================
    // RETURN: AST + Errors for ErrorBus
    // ========================================================
    // Attach errors to AST for use-parse.ts to collect
    (astWithIds as any).__errors = collectedErrors;

    return astWithIds;
}