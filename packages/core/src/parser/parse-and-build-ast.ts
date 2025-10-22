import { tokenize } from '../lexer/lexer';
import { parser } from './parser';
import { createAstBuilder } from './ast-builder';
import { generateDeterministicIds } from '../utils/deterministic-ids';
import { ERROR_CODES, ProtoError } from '../types/errors';

/**
 * @function parseAndBuildAst
 * @description Parses the input DSL text, builds a Concrete Syntax Tree (CST), and then transforms it into an Abstract Syntax Tree (AST).
 * This function is designed with error recovery in mind. Instead of throwing an error on the first issue, it collects all errors encountered
 * during the lexing, parsing, and AST building phases, and returns a partial AST along with the collected errors.
 * 
 * @param {string} text - The DSL text to be parsed.
 * @param {any} [previousAst] - An optional previous AST. If provided, it is used to reuse IDs for elements,
 * which helps maintain stability in the UI between parses, especially during live editing.
 * @returns {any} An object representing the Abstract Syntax Tree. This AST has deterministic IDs generated for its nodes.
 * It also contains a `__errors` property which is an array of all the errors collected during the process.
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
