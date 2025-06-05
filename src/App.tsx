import { useEffect, useState } from "react";
import { parseAndBuildAst } from "./core/parser/parse-and-build-ast";
import { AstNode } from './types/astNode';
import login from './examples/login';
import dashboard from './examples/dashboard';
import mobileComplete from './examples/mobile-complete';
import namedElementsExample from './examples/named-elements';
import { contactsAppExample } from './examples/contacts-app';
import { astToHtmlDocument, astToHtmlString } from './core/renderer/astToHtml';
import ExampleModal from './components/example-modal';
import AstModal from './components/ast-modal';
import { resetNavigationHistory, handleNavigationClick } from './core/renderer/navigationHelper';
import { DSLEditor } from './core/editor';
import { backNavigationExample } from './examples/back-navigation';
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

export default function App() {
    const [input, setInput] = useState(login);
    const [uiStyle, setUiStyle] = useState("iphone-x");
    const [ast, setAst] = useState<AstNode[]>([]);
    const [astResultJson, setAstResultJson] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

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

        const htmlString = astToHtmlString(ast);

        return (
            <div
                className="p-4 overflow-auto h-full w-full"
                style={{ containerType: 'inline-size' }}
                dangerouslySetInnerHTML={{ __html: htmlString }}
                onClick={handleNavigationClick}
            />
        );
    };

    const handleParse = async () => {
        try {
            const ast = await parseAndBuildAst(input);

            setAst(ast);
            setAstResultJson(JSON.stringify(ast, null, 2));
            setError(null);

        } catch (err: any) {
            setAst([]);
            setAstResultJson('');
            setError(err.message);
        }
    };

    useEffect(() => {
        handleParse();
    }, [input]);

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
                                <AstModal ast={astResultJson} html={astToHtmlString(ast)} />
                            </ActionButtons>                            <ExampleButtons
                                examples={[
                                    { label: "Login Example", code: login },
                                    { label: "Dashboard Example", code: dashboard },
                                    { label: "Mobile Example", code: mobileComplete },
                                    { label: "Named Elements", code: namedElementsExample },
                                    { label: "Back Navigation Test", code: backNavigationExample },
                                    { label: "Contacts App", code: contactsAppExample }
                                ]}
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
                    </div>                    {/* Preview Panel */}
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
