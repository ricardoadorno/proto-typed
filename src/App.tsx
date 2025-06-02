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
import { handleNavigationClick } from './core/renderer/navigationHelper';
import { initializeMonacoDSL } from './core/editor';
import { DSL_LANGUAGE_ID } from './core/editor/constants'

export default function App() {
    const [input, setInput] = useState(login);
    const [uiStyle, setUiStyle] = useState("iphone-x");
    const [screens, setScreens] = useState<AstNode[]>([]);
    const [astResult, setAstResult] = useState<string>('');
    const [currentScreen, setCurrentScreen] = useState<string>();
    const [error, setError] = useState<string | null>(null);
    const [monacoInitialized, setMonacoInitialized] = useState(false); const handleParse = () => {
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
    };    // Initialize Monaco DSL when component mounts
    useEffect(() => {
        const initMonaco = async () => {
            try {
                await initializeMonacoDSL();
                setMonacoInitialized(true);
            } catch (error) {
                console.error('Failed to initialize Monaco DSL:', error);
                setMonacoInitialized(true); // Still allow editor to load with default language
            }
        };

        initMonaco();
    }, []);

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
                className="p-4 overflow-auto h-full w-full"
                style={{ containerType: 'inline-size' }}
                dangerouslySetInnerHTML={{ __html: htmlString }}
                onClick={(e) => {
                    // Centralized navigation handler
                    handleNavigationClick(e, {
                        onInternalNavigate: (screenName: string) => {
                            console.log('[App] Navigation to screen:', screenName);
                            setCurrentScreen(screenName.toLowerCase());
                            // Hide all screens
                            const screenElements = document.querySelectorAll('.screen');
                            screenElements.forEach(screen => {
                                (screen as HTMLElement).style.display = 'none';
                            });
                            // Show the selected screen
                            const targetScreen = document.getElementById(`${screenName.toLowerCase()}-screen`);
                            console.log('[App] Target screen element:', targetScreen);
                            if (targetScreen) {
                                (targetScreen as HTMLElement).style.display = 'block';
                            }
                        }
                    });
                }}
            />
        );
    };

    useEffect(() => {
        handleParse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);

    // Set first screen as current if no screen is selected
    useEffect(() => {
        if (screens.length > 0 && !currentScreen) {
            const firstScreenName = screens[0].name;
            if (typeof firstScreenName === 'string') {
                setCurrentScreen(firstScreenName.toLowerCase());
            }
        }
    }, [screens, currentScreen]);

    // Clear currentScreen if it no longer exists in the parsed screens
    useEffect(() => {
        if (currentScreen) {
            const screenNames = screens.map(screen => {
                // FIXED: Use screen.name instead of screen.props?.name
                const name = screen.name;
                return typeof name === 'string' ? name.toLowerCase() : '';
            });
            if (!screenNames.includes(currentScreen)) {
                setCurrentScreen(undefined);
            }
        }
    }, [screens, currentScreen]);

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
        <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 pb-8">
            <div className="container mx-auto p-6">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Editor Panel */}
                    <div className="flex flex-col space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Proto-type
                                </h1>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                </div>
                            </div>

                            <p className="text-slate-600 dark:text-slate-300 mb-6">
                                Create interactive prototypes with our powerful DSL
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 mb-4">
                                <button
                                    onClick={exportAsHtml}
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                                >
                                    <span className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Export HTML</span>
                                    </span>
                                </button>
                                <ExampleModal />
                                <AstModal ast={astResult} html={astToHtml(screens)} />
                            </div>

                            {/* Example Buttons */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <button
                                    onClick={() => setInput(login)}
                                    className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 text-sm font-medium"
                                >
                                    Login Example
                                </button>
                                <button
                                    onClick={() => setInput(dashboard)}
                                    className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 text-sm font-medium"
                                >
                                    Dashboard Example
                                </button>                                <button
                                    onClick={() => setInput(mobileComplete)}
                                    className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 text-sm font-medium"
                                >
                                    Mobile Example
                                </button>
                            </div>                            {/* Device Selector */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Preview Device
                                </label>
                                <select
                                    value={uiStyle}
                                    onChange={(e) => setUiStyle(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                >
                                    <option value="iphone-x">📱 iPhone X</option>
                                    <option value="browser-mockup with-url">🖥️ Desktop Browser</option>                                </select>
                            </div>
                        </div>

                        {/* Code Editor */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden h-[600px]">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 m-4 rounded-lg">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                                                Parsing Error
                                            </h3>
                                            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                                <pre className="whitespace-pre-wrap font-mono text-xs">{error}</pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}                            <div className="h-full">
                                {monacoInitialized ? (<Editor
                                    height="100%"
                                    language={DSL_LANGUAGE_ID}
                                    theme="proto-type-dark"
                                    value={input}
                                    onChange={(value) => setInput(value || "")}
                                    options={{
                                        fontSize: 14,
                                        minimap: { enabled: false },
                                        wordWrap: "on",
                                        wrappingIndent: "same",
                                        lineNumbers: "on",
                                        padding: { top: 16, bottom: 16 },
                                        fontFamily: "'JetBrains Mono', 'Fira Code', Monaco, 'Cascadia Code', monospace",
                                        lineHeight: 1.6,
                                        cursorBlinking: "smooth",
                                        smoothScrolling: true,
                                        contextmenu: true,
                                        scrollBeyondLastLine: false,
                                        bracketPairColorization: { enabled: true },
                                        autoIndent: "full",
                                        formatOnPaste: true,
                                        formatOnType: true,
                                        suggest: {
                                            showKeywords: true,
                                            showSnippets: true,
                                            showFunctions: true,
                                            showConstructors: true,
                                            showFields: true,
                                            showVariables: true,
                                            showClasses: true,
                                            showStructs: true,
                                            showInterfaces: true,
                                            showModules: true,
                                            showProperties: true,
                                            showEvents: true,
                                            showOperators: true,
                                            showUnits: true,
                                            showValues: true,
                                            showConstants: true,
                                            showEnums: true,
                                            showEnumMembers: true,
                                            showColors: true,
                                            showFiles: true,
                                            showReferences: true,
                                            showFolders: true,
                                            showTypeParameters: true,
                                            showUsers: true,
                                            showIssues: true,
                                        },
                                    }}
                                />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-2 text-slate-600 dark:text-slate-300">Loading editor...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="flex flex-col">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                                    Live Preview
                                </h2>
                            </div>

                            {currentScreen && (
                                <div className="mb-4 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <span className="text-sm text-blue-700 dark:text-blue-300">
                                        Current Screen: <span className="font-medium">{currentScreen}</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-8">
                            {uiStyle === "browser-mockup with-url" ? (
                                <div className="browser-mockup with-url">
                                    <div className="icontent" style={{ height: '600px', width: "100%", background: 'transparent', overflow: 'auto' }}>
                                        {renderScreen({ currentScreen })}
                                    </div>
                                </div>
                            ) : (
                                <div className="iphone-x">
                                    {renderScreen({ currentScreen })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
