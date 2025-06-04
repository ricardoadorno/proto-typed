import { useEffect, useState } from "react";
import { parseInput } from "./core/parser/parser";
import { astBuilder } from "./core/parser/astBuilder";
import { AstNode } from './types/astNode';
import login from './examples/login';
import dashboard from './examples/dashboard';
import mobileComplete from './examples/mobile-complete';
import namedElementsExample from './examples/named-elements';
import { RenderOptions } from './types/renderOptions';
import { astToHtmlDocument, astToHtml } from './core/renderer/astToHtml';
import ExampleModal from './components/example-modal';
import AstModal from './components/ast-modal';
import { handleNavigationClick, resetNavigationHistory, getNavigationHistory } from './core/renderer/navigationHelper';
import { DSLEditor } from './core/editor';
import { backNavigationExample } from './examples/back-navigation';
import {
    AppHeader,
    ActionButtons,
    ExampleButtons,
    DeviceSelector,
    PreviewDevice,
    EditorPanel,
    PreviewPanel,
    CurrentScreenIndicator
} from './components/ui';

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
        a.download = "exported-screen.html"; document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const renderScreen = (renderOptions: RenderOptions) => {
        if (screens.length === 0) return null;

        // Convert AST to HTML string without React state
        const htmlString = astToHtml(screens, renderOptions);

        // Return a div with the HTML content injected and add the click handler
        return (
            <div
                className="p-4 overflow-auto h-full w-full" style={{ containerType: 'inline-size' }}
                dangerouslySetInnerHTML={{ __html: htmlString }}
                onClick={(e) => {
                    // Centralized navigation handler
                    handleNavigationClick(e, {
                        onInternalNavigate: (screenName: string) => {
                            // Check if it's a modal or drawer first
                            const allNodes = screens.flatMap(screen => screen.elements || []);
                            const isModal = allNodes.some(node => node.type === 'modal' && node.name?.toLowerCase() === screenName.toLowerCase());
                            const isDrawer = allNodes.some(node => node.type === 'drawer' && node.name?.toLowerCase() === screenName.toLowerCase());

                            if (isModal || isDrawer) {

                                // Find the actual drawer/modal name with original case
                                const drawerNode = allNodes.find(node => node.type === 'drawer' && node.name?.toLowerCase() === screenName.toLowerCase());
                                const modalNode = allNodes.find(node => node.type === 'modal' && node.name?.toLowerCase() === screenName.toLowerCase());
                                const actualName = drawerNode?.name || modalNode?.name || screenName;

                                // Use DOM manipulation directly since we don't have access to onToggle callback here
                                const drawerContainer = document.getElementById(`drawer-${actualName}`);
                                const modal = document.getElementById(`modal-${actualName}`);
                                if (drawerContainer) {
                                    const isHidden = drawerContainer.classList.contains('hidden');
                                    const drawerContent = drawerContainer.querySelector('.drawer-content');

                                    if (isHidden) {
                                        // Show drawer
                                        drawerContainer.classList.remove('hidden');
                                        if (drawerContent) {
                                            setTimeout(() => {
                                                drawerContent.classList.remove('-translate-x-full');
                                                drawerContent.classList.add('translate-x-0');
                                            }, 50);
                                        }
                                    } else {
                                        // Hide drawer
                                        if (drawerContent) {
                                            drawerContent.classList.remove('translate-x-0');
                                            drawerContent.classList.add('-translate-x-full');
                                        }
                                        setTimeout(() => {
                                            drawerContainer.classList.add('hidden');
                                        }, 300);
                                    }
                                } else if (modal) {
                                    modal.classList.toggle('hidden');
                                }
                                return;
                            }

                            // It's a regular screen - find the actual screen name with case-insensitive match
                            const screenNode = screens.find(screen => screen.name?.toLowerCase() === screenName.toLowerCase());
                            const actualScreenName = screenNode?.name || screenName;

                            // Set it as current (this will trigger re-render)
                            setCurrentScreen(actualScreenName.toLowerCase());
                        }, onBack: () => {
                            // Get the navigation history to find the previous screen
                            const history = getNavigationHistory();

                            // The navigation helper already handles the history navigation,
                            // we just need to update the React state to match
                            if (history.currentScreen) {
                                setCurrentScreen(history.currentScreen.toLowerCase());
                            }
                        }, onToggle: (elementName: string) => {
                            // For toggle actions (drawer, modal), let the navigation helper handle it
                            // and DON'T trigger a React re-render
                            console.log('[App] Toggle requested for:', elementName);
                        }
                    });
                }}
            />);
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
                // Find the parent drawer container
                const drawerContainer = e.target.closest('.drawer-container');
                if (drawerContainer) {
                    const drawerContent = drawerContainer.querySelector('.drawer-content');

                    // Hide drawer
                    if (drawerContent) {
                        drawerContent.classList.remove('translate-x-0');
                        drawerContent.classList.add('-translate-x-full');
                    }
                    setTimeout(() => {
                        drawerContainer.classList.add('hidden');
                    }, 300);
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
                            <AppHeader />

                            <ActionButtons onExportHtml={exportAsHtml}>
                                <ExampleModal />
                                <AstModal ast={astResult} html={astToHtml(screens)} />
                            </ActionButtons>                            <ExampleButtons
                                examples={[
                                    { label: "Login Example", code: login },
                                    { label: "Dashboard Example", code: dashboard },
                                    { label: "Mobile Example", code: mobileComplete },
                                    { label: "Named Elements", code: namedElementsExample },
                                    { label: "Back Navigation Test", code: backNavigationExample }
                                ]}
                                onExampleSelect={(code: string) => {
                                    setInput(code);
                                    resetNavigationHistory();
                                    setCurrentScreen(undefined);
                                }}
                            />

                            <DeviceSelector
                                value={uiStyle}
                                onChange={setUiStyle}
                            />
                        </div>
                        <EditorPanel error={error}>
                            <DSLEditor
                                value={input}
                                onChange={(value) => setInput(value || "")}
                            />
                        </EditorPanel>
                    </div>

                    {/* Preview Panel */}
                    <div className="flex flex-col">
                        <PreviewPanel>
                            {currentScreen && (
                                <CurrentScreenIndicator screenName={currentScreen} />
                            )}
                        </PreviewPanel>

                        <PreviewDevice deviceType={uiStyle}>
                            {renderScreen({ currentScreen })}
                        </PreviewDevice>
                    </div>
                </div>
            </div>
        </div>
    );
}
