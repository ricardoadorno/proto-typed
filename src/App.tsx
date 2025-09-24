import { useEffect, useState } from "react";
import { ExampleModal } from './components/examples';
import AstModal from './components/ast-modal';
import { resetNavigationHistory } from './core/renderer/route-manager';
import { DSLEditor } from './core/editor';
import { useParse } from './hooks';
import {
    AppHeader,
    ActionButtons,
    ExampleButtons,
    DeviceSelector,
    PreviewDevice,
    EditorPanel,
    PreviewPanel,
    ErrorTerminal
} from './components/ui';
import { exportDocument } from './utils';
import { exampleConfigs } from './examples';
import { Link } from 'react-router-dom';
import { astToHtmlDocument } from './core/renderer/ast-to-html-document';
import { astToHtmlString } from './core/renderer/ast-to-html-string';

export default function App() {
    const [input, setInput] = useState(exampleConfigs[0].code || "");
    const [uiStyle, setUiStyle] = useState("iphone-x");
    const {
        ast,
        astResultJson,
        error,
        parsedErrors,
        currentScreen,
        handleParse,
        navigateToScreen } = useParse();

    const exportAsHtml = () => {
        if (ast.length === 0) {
            alert("Please parse the input first to generate content.");
            return;
        }

        const documentResult = astToHtmlDocument(ast);
        exportDocument(documentResult, "exported-ast.html");
    };

    const renderScreen = () => {
        if (ast.length === 0) return null;

        const htmlString = astToHtmlString(ast, { currentScreen });

        return (
            <div
                className="overflow-auto h-full w-full"
                style={{ containerType: 'inline-size' }}
                dangerouslySetInnerHTML={{ __html: htmlString }}
                onClick={handlePreviewNavigation}
            />
        );
    };

    const handlePreviewNavigation = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        const navElement = target.closest('[data-nav]');

        if (!navElement) return;

        e.preventDefault();
        e.stopPropagation();

        const navTarget = navElement.getAttribute('data-nav');
        const navType = navElement.getAttribute('data-nav-type');

        console.log('Preview navigation click:', {
            navTarget,
            navType,
            element: navElement,
            allDataAttrs: Object.fromEntries(
                Array.from(navElement.attributes)
                    .filter(attr => attr.name.startsWith('data-'))
                    .map(attr => [attr.name, attr.value])
            )
        });

        if (!navTarget) return;

        if (navType === 'internal') {
            // Navigate to screen - update React state
            console.log('Navigating to screen:', navTarget);
            navigateToScreen(navTarget);
        } else if (navType === 'toggle') {
            // Toggle modal/drawer
            console.log('Toggling element:', navTarget);
            togglePreviewElement(navTarget);
        } else if (navType === 'back') {
            // Handle back navigation
            console.log('Back navigation');
            // Could implement history management here if needed
        } else {
            // Default behavior for elements without explicit type
            console.log('Default navigation - attempting toggle for:', navTarget);
            togglePreviewElement(navTarget);
        }
    };

    const togglePreviewElement = (elementName: string) => {
        console.log('Looking for elements:', {
            elementName,
            modalId: `modal-${elementName}`,
            drawerId: `drawer-${elementName}`
        });

        const modal = document.getElementById(`modal-${elementName}`);
        const drawer = document.getElementById(`drawer-${elementName}`);

        console.log('Found elements:', { modal, drawer });

        // Try to find elements by data attributes as fallback
        if (!modal && !drawer) {
            const modalByData = document.querySelector(`[data-modal="${elementName}"]`);
            const drawerByData = document.querySelector(`[data-drawer="${elementName}"]`);
            console.log('Fallback search:', { modalByData, drawerByData });
        }

        if (modal) {
            const isHidden = modal.classList.contains('hidden');
            console.log('Modal state:', { isHidden, classList: Array.from(modal.classList) });

            if (isHidden) {
                modal.classList.remove('hidden');
                // Add backdrop click handler
                const backdrop = modal.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.addEventListener('click', (e) => {
                        if (e.target === backdrop) {
                            modal.classList.add('hidden');
                        }
                    });
                }
            } else {
                modal.classList.add('hidden');
            }
        }

        if (drawer) {
            const isHidden = drawer.classList.contains('hidden');
            const content = drawer.querySelector('.drawer-content');

            console.log('Drawer state:', {
                isHidden,
                classList: Array.from(drawer.classList),
                contentClasses: content ? Array.from(content.classList) : null
            });

            if (isHidden) {
                drawer.classList.remove('hidden');
                if (content) {
                    content.classList.add('translate-x-0');
                    content.classList.remove('-translate-x-full');
                }
                // Add backdrop click handler
                const overlay = drawer.querySelector('.drawer-overlay');
                if (overlay) {
                    overlay.addEventListener('click', (e) => {
                        if (e.target === overlay) {
                            if (content) {
                                content.classList.remove('translate-x-0');
                                content.classList.add('-translate-x-full');
                            }
                            setTimeout(() => {
                                drawer.classList.add('hidden');
                            }, 300);
                        }
                    });
                }
            } else {
                if (content) {
                    content.classList.remove('translate-x-0');
                    content.classList.add('-translate-x-full');
                }
                setTimeout(() => {
                    drawer.classList.add('hidden');
                }, 300);
            }
        }

        if (!modal && !drawer) {
            console.warn('No modal or drawer found for element:', elementName);
        }
    };

    useEffect(() => {
        handleParse(input);
    }, [input, handleParse]);


    return (<div className="min-h-full bg-gradient-to-br from-slate-900 to-slate-800 pb-8">
        <div className="w-full">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8 p-4 md:p-6">
                {/* Editor Panel */}
                <div className="flex flex-col space-y-4 md:space-y-6 order-2 xl:order-1">
                    <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-4 md:p-6">

                        <AppHeader />
                        <Link to="/docs" className="text-sm text-blue-400 hover:underline mb-4 inline-block">
                            View Documentation
                        </Link>

                        <ActionButtons onExportHtml={exportAsHtml}>
                            <ExampleModal />
                            <AstModal ast={astResultJson} html={astToHtmlString(ast, { currentScreen: currentScreen || undefined })} />                            </ActionButtons>

                        <ExampleButtons
                            examples={exampleConfigs}
                            onExampleSelect={(code: string) => {
                                setInput(code);
                                resetNavigationHistory();
                            }}
                        />

                        <DeviceSelector
                            value={uiStyle}
                            onChange={setUiStyle}
                        />
                    </div>
                    <EditorPanel>
                        <DSLEditor
                            value={input}
                            onChange={(value) => setInput(value || "")}
                            errors={parsedErrors}
                        />
                    </EditorPanel>
                    <ErrorTerminal error={error} code={input} />

                </div>

                {/* Preview Panel */}
                <div className="flex flex-col order-1 xl:order-2">
                    <PreviewPanel />

                    <PreviewDevice deviceType={uiStyle}>
                        {renderScreen()}
                    </PreviewDevice>
                </div>
            </div>
        </div>
    </div>
    );
}
