import { useState, useEffect, useCallback } from 'react';
import Modal from '../ui/modal';
import { parseAndBuildAst } from '../../core/parser/parse-and-build-ast';

// Import example data
import layoutExamples from './layout';
import formExamples from './forms';
import interactiveExamples from './interactive';
import displayExamples from './display';
import mobileExamples from './mobile';

// Import UI components
import {
    ExampleTabs,
    ExampleSelector,
    CodeDisplay,
    LivePreview,
    SyntaxTips
} from './ui';

import { ExampleData } from './types';
import { astToHtmlString } from '../../core/renderer/ast-to-html-string';

/**
 * Comprehensive example modal showcasing all DSL syntax with organized, documented examples
 */
export function ExampleModal() {
    const [activeTab, setActiveTab] = useState('layout');
    const [selectedExample, setSelectedExample] = useState(0);
    const [compiledOutput, setCompiledOutput] = useState('');
    const [currentScreen, setCurrentScreen] = useState<string>();    // Organize all example data
    const exampleData: ExampleData = {
        layout: layoutExamples,
        forms: formExamples,
        interactive: interactiveExamples,
        display: displayExamples,
        mobile: mobileExamples,
    };    /**
     * Compile the currently selected example to HTML
     */
    const compileCurrentExample = async (codeToCompile?: string) => {
        try {
            const currentCategory = exampleData[activeTab as keyof ExampleData];
            const example = currentCategory.examples[selectedExample];

            if (!example) {
                setCompiledOutput('<div class="error">No example selected</div>');
                return;
            }

            // Use provided code or fall back to example code
            const codeToUse = codeToCompile ?? example.code;
            const ast = await parseAndBuildAst(codeToUse);
            const html = astToHtmlString(ast, { currentScreen });
            setCompiledOutput(html);
        } catch (error) {
            console.error("Error compiling example:", error);
            setCompiledOutput(`<div class="error">Error compiling example: ${error instanceof Error ? error.message : 'Unknown error'}</div>`);
        }
    };    // Handle code changes from the editor with debouncing
    const handleCodeChange = useCallback((newCode: string) => {
        // Clear existing timeout
        const timeoutId = setTimeout(() => {
            compileCurrentExample(newCode);
        }, 300); // 300ms debounce

        // Cleanup function
        return () => clearTimeout(timeoutId);
    }, [currentScreen]);

    // Recompile when tab, example, or screen changes
    useEffect(() => {
        compileCurrentExample();
    }, [activeTab, selectedExample, currentScreen]);

    // Reset example selection when tab changes
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setSelectedExample(0);
    };

    const handleScreenChange = (screen: string) => {
        setCurrentScreen(screen);
    };

    const currentCategory = exampleData[activeTab as keyof ExampleData];
    const currentExample = currentCategory.examples[selectedExample];

    return (
        <Modal
            buttonText="📚 DSL Reference"
            buttonVariant="primary"
            header={
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        proto-typed DSL Reference
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                        Interactive examples and live preview of the UI DSL syntax
                    </p>
                </div>
            }
            content={
                <div className="space-y-6">                    {/* Tab Navigation */}
                    <ExampleTabs
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />

                    {/* Category Title and Example Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                                {currentCategory.title}
                            </h3>
                        </div>

                        <ExampleSelector
                            examples={currentCategory.examples}
                            selectedExample={selectedExample}
                            onExampleChange={setSelectedExample}
                        />
                    </div>

                    {/* Code and Preview Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">                        {/* DSL Code Section */}
                        <CodeDisplay
                            code={currentExample.code}
                            description={currentExample.description}
                            onCodeChange={handleCodeChange}
                            editable={true}
                        />{/* Live Preview Section */}
                        <LivePreview
                            code={compiledOutput}
                            onScreenChange={handleScreenChange}
                        />
                    </div>

                    {/* Syntax Tips */}
                    <SyntaxTips activeTab={activeTab} />
                </div>
            }
        />
    );
}

export default ExampleModal;
