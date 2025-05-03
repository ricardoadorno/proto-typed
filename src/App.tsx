import { useEffect, useState } from "react";
import { parseInput } from "./core/parser/parser";
import { astBuilder } from "./core/parser/astBuilder";
import { AstNode } from './types/astNode';
import login from './examples/login';
import dashboard from './examples/dashboard';
import { RenderOptions } from './types/renderOptions';
import { astToHtmlDocument } from './core/renderer/documentRenderer';
import { astToHtml } from './core/renderer/astToHtml';
import AceEditor from "react-ace";
import ace from 'ace-builds/src-noconflict/ace';
import ExampleModal from './components/example-modal';
import AstModal from './components/ast-modal';

ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict');

export default function App() {
    const [input, setInput] = useState(dashboard);
    const [uiStyle, setUiStyle] = useState("iphone-x");
    const [screens, setScreens] = useState<AstNode[]>([]);
    const [astResult, setAstResult] = useState<string>('');
    const [currentScreen, setCurrentScreen] = useState<string>();

    const [error, setError] = useState<string | null>(null);

    const handleParse = () => {
        try {
            const screenInputs = input.split(/(?=@screen\s)/);

            const parsedScreens = screenInputs
                .map(screenInput => screenInput.trim())
                .filter(Boolean)
                .map(screenInput => {
                    const cst = parseInput(screenInput);
                    const ast = astBuilder.visit(cst);

                    console.log('ast', ast); // Log the AST for debugging


                    setAstResult(astResult + JSON.stringify(ast, null, 2));
                    return ast;
                });

            setScreens(parsedScreens);
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
                style={{ padding: "2rem 1rem 1rem 1rem", overflow: "auto", height: "100%", width: "100%" }}
                dangerouslySetInnerHTML={{ __html: htmlString }}
                onClick={(e) => {
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
    };

    useEffect(() => {
        handleParse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);


    return (
        <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: "2rem" }}>

            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <h2>UI DSL Parser</h2>
                <div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button onClick={exportAsHtml} style={{ backgroundColor: "#28a745" }}>Export as HTML</button>
                        <ExampleModal />
                        {/* <AstModal ast={astResult} html={astToHtml(screens)} /> */}
                    </div>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <button onClick={() => setInput(login)}>Login Example</button>
                        <button onClick={() => setInput(dashboard)}>Dashboard Example</button>
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
                {error && <pre style={{ color: "red", height: "5rem", padding: "1rem" }}>{error}</pre>}
                <AceEditor
                    placeholder=""
                    mode="html"
                    theme="github"
                    className="code-editor"
                    name="codeeditor"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    onChange={
                        (newValue) => {
                            setInput(newValue);
                        }
                    }
                    fontSize={13}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={input}
                    setOptions={{
                        useWorker: false,
                        showLineNumbers: true,
                        tabSize: 2,
                    }} />
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
                <div className={uiStyle}>
                    {renderScreen({ currentScreen })}
                </div>
            </div>
        </div>
    );
}
