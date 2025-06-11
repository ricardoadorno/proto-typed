import { useEffect, useState } from "react";
import { astToHtmlDocument, astToHtmlString } from './core/renderer/ast-to-html';
import { ExampleModal } from './components/examples';
import AstModal from './components/ast-modal';
import { resetNavigationHistory, handleNavigationClick } from './core/renderer/navigation-service';
import { DSLEditor } from './core/editor';
import { useParse } from './hooks';
import {
    AppHeader,
    ActionButtons,
    ExampleButtons,
    DeviceSelector,
    PreviewDevice,
    EditorPanel,
    PreviewPanel
} from './components/ui';
import { exportDocument } from './utils';
import { exampleConfigs } from './examples';

export default function App() {
    const [input, setInput] = useState(exampleConfigs[0].code || "");
    const [uiStyle, setUiStyle] = useState("iphone-x");
    const {
        ast,
        astResultJson,
        error,
        currentScreen,
        handleParse } = useParse();

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
                onClick={handleNavigationClick}
            />
        );
    };

    useEffect(() => {
        handleParse(input);
    }, [input, handleParse]); return (<div className="min-h-full bg-gradient-to-br from-slate-900 to-slate-800 pb-8">
        <div className="w-full">
            <div className="grid lg:grid-cols-2 gap-8 p-6">
                {/* Editor Panel */}
                <div className="flex flex-col space-y-6">
                    <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6">
                        <AppHeader />                            <ActionButtons onExportHtml={exportAsHtml}>
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
                    <EditorPanel error={error}>
                        <DSLEditor
                            value={input}
                            onChange={(value) => setInput(value || "")}
                        />
                    </EditorPanel>
                </div>
                <div className="flex flex-col">
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
