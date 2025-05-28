import { useEffect, useState } from "react";
import { parseInput } from "./core/parser/parser";
import { astBuilder } from "./core/parser/astBuilder";
import { AstNode } from './types/astNode';
import login from './examples/login';
import dashboard from './examples/dashboard';
import mobileComplete from './examples/mobile-complete';
import { RenderOptions } from './types/renderOptions';
import { astToHtmlDocument } from './core/renderer/documentRenderer';
import { astToHtml } from './core/renderer/astToHtml';
import ExampleModal from './components/example-modal';
import AstModal from './components/ast-modal';
import { Editor } from '@monaco-editor/react';


export default function App() {
    const [input, setInput] = useState(login);
    const [uiStyle, setUiStyle] = useState("iphone-x");
    const [screens, setScreens] = useState<AstNode[]>([]);
    const [astResult, setAstResult] = useState<string>('');
    const [currentScreen, setCurrentScreen] = useState<string>();

    const [error, setError] = useState<string | null>(null);

    const handleParse = () => {
        try {
            // Now we can parse multiple screens at once with the program rule
            const cst = parseInput(input);
            const ast = astBuilder.visit(cst);

            // ast is now an array of screens
            setScreens(ast);
            setAstResult(JSON.stringify(ast, null, 2));
            setError(null);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setScreens([]);
            setError(err.message);
        }
    };

    const exportAsHtml = () => {
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
    };

    const renderScreen = (renderOptions: RenderOptions) => {
        if (screens.length === 0) return null;

        // Convert AST to HTML string
        const htmlString = astToHtml(screens, renderOptions);

        // Return a div with the HTML content injected and add the click handler
        return (
            <div
                style={{ padding: "2rem 1rem 1rem 1rem", overflow: "auto", height: "100%", width: "100%", containerType: 'inline-size' }}
                dangerouslySetInnerHTML={{ __html: htmlString }} onClick={(e) => {
                    // Handle navigation with data-nav attributes
                    const target = (e.target as Element).closest('[data-nav]');
                    if (target) {
                        e.preventDefault();

                        const navValue = target.getAttribute('data-nav');
                        const navType = target.getAttribute('data-nav-type'); if (navValue && navType === 'internal') {
                            setCurrentScreen(navValue);
                            // Hide all screens
                            const screenElements = document.querySelectorAll('.screen');
                            screenElements.forEach(screen => {
                                (screen as HTMLElement).style.display = 'none';
                            });

                            // Show the selected screen
                            const targetScreen = document.getElementById(`${navValue.toLowerCase()}-screen`);
                            if (targetScreen) {
                                targetScreen.style.display = 'block';
                            }
                        } else if (navType === 'drawer-toggle') {
                            // Handle drawer toggle
                            const drawer = document.querySelector('.drawer');
                            const overlay = document.querySelector('.drawer-overlay');

                            if (drawer) {
                                drawer.classList.toggle('open');
                            }

                            if (overlay) {
                                overlay.classList.toggle('open');
                            }
                        } else if (navType === 'external') {
                            window.open(navValue, '_blank', 'noopener,noreferrer');
                        } else if (navType === 'action') {
                            try {
                                // Execute the action in the global scope
                                new Function(navValue)();
                            } catch (error) {
                                console.error('Error executing navigation action:', error);
                            }
                        }
                        return;
                    }

                    // Legacy support for data-screen-link
                    if (e.target instanceof HTMLAnchorElement && e.target.hasAttribute('data-screen-link')) {
                        e.preventDefault();

                        const screenName = e.target.getAttribute('data-screen-link');
                        if (screenName) {
                            setCurrentScreen(screenName);
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
    }; useEffect(() => {
        handleParse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);

    useEffect(() => {
        // Handle overlay clicks to close drawer
        const handleOverlayClick = (e: Event) => {
            if (e.target instanceof HTMLElement && e.target.classList.contains('drawer-overlay')) {
                const drawer = document.querySelector('.drawer');
                const overlay = document.querySelector('.drawer-overlay');

                if (drawer) {
                    drawer.classList.remove('open');
                }

                if (overlay) {
                    overlay.classList.remove('open');
                }
            }
        };

        document.addEventListener('click', handleOverlayClick);

        return () => {
            document.removeEventListener('click', handleOverlayClick);
        };
    }, []);


    return (
        <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: "2rem" }}>

            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <h2>UI DSL Parser</h2>
                <div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button onClick={exportAsHtml} style={{ backgroundColor: "#28a745" }}>Export as HTML</button>
                        <ExampleModal />
                        <AstModal ast={astResult} html={astToHtml(screens)} />
                    </div>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <button onClick={() => setInput(login)}>Login Example</button>
                        <button onClick={() => setInput(dashboard)}>Dashboard Example</button>
                        <button onClick={() => setInput(mobileComplete)}>Mobile Complete Example</button>
                    </div>
                    <select
                        value={uiStyle}
                        onChange={(e) => setUiStyle(e.target.value)}
                        style={{
                            marginTop: "1rem",
                        }}
                    >
                        <option value="iphone-x">iPhone X</option>
                        <option value="browser-mockup with-url">Browser</option>
                    </select>
                </div>
                <div
                    style={{
                        maxWidth: "800px",
                    }}
                >
                    {error && <pre style={{ color: "red", maxHeight: "5rem", padding: "1rem" }}>{error}</pre>}
                    <Editor
                        height="90vh"
                        value={input}
                        onChange={(value) => setInput(value || "")}
                        options={{
                            fontSize: 13,
                            minimap: { enabled: false },
                            wordWrap: "on",
                            wrappingIndent: "same",
                            lineNumbers: "on",
                        }}
                    />
                </div>
            </div>

            <div>
                <h3 style={{ padding: "1rem 0" }}>Rendered Screen</h3>
                <div className={uiStyle}>
                    {renderScreen({ currentScreen })}
                </div>
            </div>
        </div>
    );
}
