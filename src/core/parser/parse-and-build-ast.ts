import { tokenize } from '../lexer/lexer';
import { parser } from './parser';

/**
 * Parse input text into a Concrete Syntax Tree (CST) and then outputs an Abstract Syntax Tree (AST).
 * 
 * @param text The DSL text to parse
 * @returns The Concrete Syntax Tree representing the parsed input
 * @throws Error if parsing fails
 */
export async function parseAndBuildAst(text: string) {
    // Import AstBuilder dynamically to avoid circular dependency
    const { default: AstBuilder } = await import('./ast-builder');

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

    const builder = new AstBuilder();

    const ast = builder.visit(cst);

    // Return the built AST
    return ast;
}