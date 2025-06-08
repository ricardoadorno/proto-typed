import { tokenize } from '../lexer/lexer';
import { parser } from './parser';

/**
 * Parse input text into a Concrete Syntax Tree (CST)
 * 
 * @param text The DSL text to parse
 * @returns The Concrete Syntax Tree representing the parsed input
 * @throws Error if parsing fails
 */
export async function parseAndBuildAst(text: string) {
    // Import AstBuilder dynamically to avoid circular dependency
    const { default: AstBuilder } = await import('./astBuilder');

    // First tokenize the text using the lexer
    const lexResult = tokenize(text);

    // Set the tokens as input to the parser
    parser.input = lexResult.tokens;

    // Parse the tokens according to the grammar rules
    const cst = parser.program();

    // If there are parsing errors, throw an error
    if (parser.errors.length > 0) {
        console.error('parser.errors', parser.errors);
        throw new Error("Parsing error: " + parser.errors[0].message);
    }

    const builder = new AstBuilder();

    const ast = builder.visit(cst);

    // Return the built AST
    return ast;
}