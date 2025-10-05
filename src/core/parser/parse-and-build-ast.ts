import { tokenize } from '../lexer/lexer';
import { parser } from './parser';
import { createAstBuilder } from './ast-builder';
import { generateDeterministicIds } from '../utils/deterministic-ids';

/**
 * Parse input text into a Concrete Syntax Tree (CST) and then outputs an Abstract Syntax Tree (AST).
 * 
 * @param text The DSL text to parse
 * @param previousAst Optional previous AST for ID reuse (for better stability between parses)
 * @returns The Abstract Syntax Tree representing the parsed input with deterministic IDs
 * @throws Error if parsing fails
 */
export function parseAndBuildAst(text: string, previousAst?: any) {
    // First tokenize the text using the lexer
    const lexResult = tokenize(text);

    // Set the tokens as input to the parser
    parser.input = lexResult.tokens;

    // Parse the tokens according to the grammar rules
    const cst = parser.program();

    // If there are parsing errors, throw an error
    if (parser.errors.length > 0) {
        console.error('parser.errors', parser.errors);
        const error = parser.errors[0];
        
        // Extract position information from the token
        let errorMessage = "Parsing error: " + error.message;
        
        // Try to get position from the error token
        if (error.token) {
            const line = error.token.startLine || 1;
            const column = error.token.startColumn || 1;
            errorMessage += ` at line ${line}, column ${column}`;
        }
        
        throw new Error(errorMessage);
    }

    const builder = createAstBuilder(parser);

    const ast = builder.visit(cst);

    // Generate deterministic IDs for all nodes in the AST
    const astWithIds = generateDeterministicIds(ast, previousAst);

    // Return the built AST with deterministic IDs
    return astWithIds;
}