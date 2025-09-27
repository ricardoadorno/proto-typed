import { useEffect, useState } from "react";
import { ExampleModal } from './components/examples';
import AstModal from './components/ast-modal';
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
import { astToHtmlStringPreview } from './core/renderer/ast-to-html-string-preview';
import { routeManagerGateway } from './core/renderer/helpers/route-manager-gateway';

export default function App() {
    const [input, setInput] = useState(exampleConfigs[0].code || "");
    const [uiStyle, setUiStyle] = useState("iphone-x");
    const {
        ast,
        astResultJson,
        error,
        parsedErrors,
        currentScreen,
        metadata,
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

        // Usar o currentScreen do estado React como fonte da verdade
        const htmlString = astToHtmlStringPreview(ast, { currentScreen });

        return (
            <div
                className="overflow-auto h-full w-full"
                style={{ containerType: 'inline-size' }}
                dangerouslySetInnerHTML={{ __html: htmlString }}
                onClick={routeManagerGateway.createClickHandler()}
                data-current-screen={currentScreen}
            />
        );
    };

    // Configure navigation handlers on mount
    useEffect(() => {
        routeManagerGateway.setHandlers({
            onScreenNavigation: navigateToScreen,
        });
    }, [navigateToScreen]);

    // Initialize navigation history when current screen is available
    useEffect(() => {
        if (currentScreen) {
            routeManagerGateway.initializeNavigation(currentScreen);
        }
    }, [currentScreen]);

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
                            <AstModal ast={astResultJson} html={astToHtmlStringPreview(ast, { currentScreen: currentScreen || undefined })} />
                        </ActionButtons>

                        <ExampleButtons
                            examples={exampleConfigs}
                            onExampleSelect={(code: string) => {
                                setInput(code);
                                routeManagerGateway.resetNavigation();
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
                    <PreviewPanel metadata={metadata} onNavigateToScreen={navigateToScreen} />

                    <PreviewDevice deviceType={uiStyle}>
                        {renderScreen()}
                    </PreviewDevice>
                </div>
            </div>
        </div>
    </div>
    );
}
