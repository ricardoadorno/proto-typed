"use client";

import { useEffect, useState } from "react";
import AstModal from '../components/ui/ast-modal';
import { DSLEditor } from '../core/editor';
import { useParse } from '../hooks/use-parse';
import {
  AppHeader,
  ActionButtons,
  ExampleButtons,
  DeviceSelector,
  ThemeSelector,
  PreviewDevice,
  EditorPanel,
  PreviewPanel,
} from '../components/ui';
import { exportDocument } from '../utils';
import { exampleConfigs } from '../examples';
import { astToHtmlDocument } from '../core/renderer/ast-to-html-document';
import { customPropertiesManager } from '../core/renderer/core/theme-manager';
import { withBaseUrl } from '@/utils/with-base-url';

export default function App() {
  const [input, setInput] = useState(exampleConfigs[0].code || "");
  const [uiStyle, setUiStyle] = useState("iphone-x");
  const [selectedTheme, setSelectedTheme] = useState("neutral");
  const {
    ast,
    astResultJson,
    renderedHtml,
    metadata,
    handleParse,
    navigateToScreen,
    createClickHandler,
  } = useParse();

  const exportAsHtml = () => {
    if (Object.keys(ast).length === 0) {
      alert("Please parse the input first to generate content.");
      return;
    }

    const documentResult = astToHtmlDocument(ast);
    exportDocument(documentResult, "exported-ast.html");
  };

  const renderScreen = () => {
    if (!renderedHtml) return null;

    return (
      <div
        className="overflow-auto h-full w-full"
        style={{ containerType: 'inline-size' }}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
        onClick={createClickHandler()}
      />
    );
  };

  useEffect(() => {
    handleParse(input);
  }, [input, handleParse]);

  // Sync theme changes with the theme manager
  useEffect(() => {
    customPropertiesManager.setExternalTheme(selectedTheme);
    // Trigger re-parsing to apply theme changes
    handleParse(input);
  }, [selectedTheme, input, handleParse]);

  return (<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-8">
    <div className="w-full h-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 h-full">
        {/* Editor Panel */}
        <div className="flex flex-col space-y-4 md:space-y-6 order-2 xl:order-1 h-full">
          <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-4 md:p-6">

            <AppHeader />
            <a href={withBaseUrl('docs')} className="text-sm text-blue-400 hover:underline mb-4 inline-block">
              View Documentation
            </a>

            <ActionButtons onExportHtml={exportAsHtml}>
              {/* <ExampleModal /> */}
              <AstModal ast={astResultJson} html={renderedHtml} />
            </ActionButtons>

            <ExampleButtons
              examples={exampleConfigs}
              onExampleSelect={(code: string) => {
                setInput(code);
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <DeviceSelector
                value={uiStyle}
                onChange={setUiStyle}
              />
              <ThemeSelector
                value={selectedTheme}
                onChange={setSelectedTheme}
              />
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <EditorPanel>
              <DSLEditor
                value={input}
                onChange={(value) => setInput(value || "")}
              />
            </EditorPanel>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col order-1 xl:order-2 h-full">
          <PreviewPanel metadata={metadata} onNavigateToScreen={navigateToScreen} />

          <div className="flex-1 min-h-0">
            <PreviewDevice deviceType={uiStyle}>
              {renderScreen()}
            </PreviewDevice>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
