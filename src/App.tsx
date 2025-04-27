import { useState } from "react";
import { parseInput } from "./dslParser";
import { astBuilder } from "./astBuilder";
import { astToHtml, astToHtmlDocument } from "./astToHtml";
import { AstNode } from './types/astNode';


export default function App() {
    const [input, setInput] = useState(`@screen SyntaxDemo:
  # Syntax Demonstration
  text This screen demonstrates all syntax elements available in our DSL.
  
  ## Typography
  # Heading 1
  ## Heading 2
  ### Heading 3
  text This is a paragraph of text that demonstrates the text element.
  
  ---
  
  ## Media Elements
  image ["https://picsum.photos/200/100"] Sample Image
  
  ## Interactive Elements
  link ["https://github.com"] GitHub Link
  button Submit Form
  
  ## Form Elements
  input text Username
  input password Password
  
  radio
    () Option 1
    (X) Option 2
    () Option 3
  
  checkbox
    [X] Remember me
    [ ] Subscribe to newsletter
    [X] Accept terms
  
  select
    <[Option 1]>
    <[Option 2]>
    <[Option 3]>
  
  range 0 100
  
  ## Layout Elements
  row []
    col []
      text Column 1 content
    col []
      text Column 2 content
  
  ## Complex Components
  card
    row []
      # Card Title
    row full
      text Card content goes here
      input text Card input
    row []
      button Submit
      button Cancel
      
  ## Navigation
  link ["SecondScreen"] Go to Second Screen
  
@screen SecondScreen:
  # Second Screen
  text This is another screen to demonstrate navigation.  ## Cards with Grid Layout
  card
    grid
      text "First grid item"
      text "Second grid item"
      text "Third grid item"
  
  quote This is a special quote element that can be used to highlight important information.
  
  note This is a note element for showing additional context or hints.
  
  [Go back to first screen](SyntaxDemo)
  `);
    const [screens, setScreens] = useState<AstNode[]>([]);
    const [error, setError] = useState<string | null>(null); const handleParse = () => {
        try {
            const screenInputs = input.split(/(?=@screen\s)/);

            const parsedScreens = screenInputs
                .map(screenInput => screenInput.trim())
                .filter(Boolean)
                .map(screenInput => {
                    const cst = parseInput(screenInput);
                    const ast = astBuilder.visit(cst);

                    return ast;
                });

            setScreens(parsedScreens);
            setError(null);
        } catch (err: any) {
            setScreens([]);
            setError(err.message);
        }
    }; const exportAsHtml = () => {
        if (screens.length === 0) {
            alert("Please parse the input first to generate content.");
            return;
        }

        // Convert screens to HTML document using the astToHtmlDocument function
        const serializedScreens = astToHtmlDocument(screens);

        // Create a blob and download it
        const blob = new Blob([serializedScreens], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "exported-screen.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }; const renderScreen = () => {
        if (screens.length === 0) return null;

        // Convert AST to HTML string
        const htmlString = astToHtml(screens);

        // Return a div with the HTML content injected and add the click handler
        return (
            <div
                dangerouslySetInnerHTML={{ __html: htmlString }}
                onClick={(e) => {
                    // Handle link clicks for screen navigation
                    if (e.target instanceof HTMLAnchorElement && e.target.hasAttribute('data-screen-link')) {
                        e.preventDefault();

                        const screenName = e.target.getAttribute('data-screen-link');
                        if (screenName) {
                            // Hide all screens
                            const screenElements = document.querySelectorAll('.screen');
                            screenElements.forEach(screen => {
                                (screen as HTMLElement).style.display = 'none';
                            });

                            // Show the selected screen
                            const targetScreen = document.getElementById(`${screenName.toLowerCase()}-screen`);
                            if (targetScreen) {
                                targetScreen.style.display = 'block';
                            }
                        }
                    }
                }}
            />
        );
    };

    return (
        <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: "2rem" }}>

            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <h2>UI DSL Parser</h2>
                <div>
                    <button onClick={handleParse} style={{ marginRight: 10 }}>Parse</button>
                    <button onClick={exportAsHtml} style={{ backgroundColor: "#28a745" }}>Export as HTML</button>
                </div>
                {error && <pre style={{ color: "red" }}>{error}</pre>}
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={10}
                    style={{
                        flex: 1,
                        width: "100%",
                        minHeight: "100rem",
                        fontFamily: "monospace",
                        marginTop: "1rem",
                        resize: "none",
                    }}
                />
            </div>

            {/* <div>
                    <h3>Screens AST Output</h3>
                    {screens.length > 0 && (
                        <pre style={{ maxHeight: 300, overflow: 'auto' }}>
                            {JSON.stringify(screens, null, 2)}
                        </pre>
                    )}
                </div> */}
            <div>
                <h3 style={{ padding: "1rem 0" }}>Rendered Screen</h3>
                {renderScreen()}
            </div>
        </div>
    );
}
