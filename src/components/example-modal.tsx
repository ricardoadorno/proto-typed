import { useState, useEffect } from 'react';
import Modal from './modal';
import { parseInput } from '../core/parser/parser';
import { astBuilder } from '../core/parser/astBuilder';
import { astToHtml } from '../core/renderer/astToHtml';

/**
 * Example modal component that shows all the syntax supported by the DSL with live previews
 */
export default function ExampleModal() {
    const [activeTab, setActiveTab] = useState('layout');
    const [compiledOutput, setCompiledOutput] = useState('');
    const [currentScreen, setCurrentScreen] = useState<string>();

    const syntaxExamples = {
        layout: {
            title: "Layout Elements",
            examples: [
                {
                    name: "Layout",
                    code: `@screen GridExample:
    col:
      row:
        # First Column
        > Content in first column
      row:
        # Second Column
        > Content in second column`,
                    description: "Create responsive layouts with rows and columns"
                },
                {
                    name: "Card Component",
                    code: `@screen CardExample:
  card:
    # Card Title
    > Card content goes here
    @[Action Button]`,
                    description: "Group related content in a container with optional header and actions"
                },
                {
                    name: "Separator",
                    code: `@screen SeparatorExample:
  # Section 1
  > Content above separator
  ---
  # Section 2
  > Content below separator`,
                    description: "Add a horizontal line to separate content sections"
                }
            ]
        },
        input: {
            title: "Input Elements",
            examples: [
                {
                    name: "Text Inputs",
                    code: `@screen InputExample:
  # Form Fields
  ___:Username(Enter your username)[text]
  ___:Password(Enter your password)[password]
  ___*:Email(Enter your email)[email]
  ___-:Disabled Field(This field is disabled)[text]`,
                    description: "Create various types of input fields with labels, placeholders, required and disabled states"
                },
                {
                    name: "Checkboxes",
                    code: `@screen CheckboxExample:
  # Checkbox Options
  [X] Option 1 (checked)
  [ ] Option 2 (unchecked)`,
                    description: "Create checkboxes with checked or unchecked state"
                },
                {
                    name: "Radio Buttons",
                    code: `@screen RadioExample:
  # Radio Options
  (X) Option A (selected)
  ( ) Option B (unselected)
  ( ) Option C (unselected)`,
                    description: "Create radio button groups where only one option can be selected"
                },
                {
                    name: "Select Fields",
                    code: `@screen SelectExample:
  # Select Menu
  ___:Country(Select your country)[USA | Canada | Mexico | Brazil]
  ___*:Language(Choose language)[English | Spanish | French | Portuguese]
  ___-:Disabled Select(Can't change this)[Option 1 | Option 2 | Option 3]
  
  # Legacy Select Syntax
  <[Legacy Option 1]>
  <[Legacy Option 2]>`,
                    description: "Create dropdown select menus with options, labels, required fields, and disabled state"
                },
            ]
        },
        content: {
            title: "Content Elements",
            examples: [
                {
                    name: "Headings",
                    code: `@screen HeadingExample:
  # Heading 1
  ## Heading 2
  ### Heading 3
  #### Heading 4`,
                    description: "Create headings of different levels using # symbols"
                },
                {
                    name: "Text Styles",
                    code: `@screen TextExample:
  > Regular paragraph text
  *> Note styled text with emphasis
  "> Quote styled text for citations`,
                    description: "Apply different text styles using prefix symbols"
                },
                {
                    name: "Lists",
                    code: `@screen ListExample:
  # Ordered List
  1. First ordered item
  2. Second ordered item
  
  # Unordered List
  - First unordered item
  - Second unordered item`,
                    description: "Create ordered (numbered) and unordered (bullet) lists"
                },
                {
                    name: "Interactive Elements",
                    code: `@screen InteractiveExample:
  # Interactive Elements
  @[Button Text]
  #[Link Text](screen destination)
  ![Image Alt Text](https://picsum.photos/200/100)`,
                    description: "Add buttons, links, and images to your interface"
                }
            ]
        }
    };

    const tabs = [
        { id: 'layout', label: 'Layout Elements' },
        { id: 'input', label: 'Input Elements' },
        { id: 'content', label: 'Content Elements' }
    ];

    const [selectedExample, setSelectedExample] = useState(0);

    // Compile the selected example
    useEffect(() => {
        try {
            const currentExamples = syntaxExamples[activeTab as keyof typeof syntaxExamples].examples;
            const example = currentExamples[selectedExample];
            const cst = parseInput(example.code);
            const ast = astBuilder.visit(cst);
            const html = astToHtml(ast, { currentScreen });

            setCompiledOutput(html);
        } catch (error) {
            console.error("Error compiling example:", error);
            setCompiledOutput('<div class="error">Error compiling example</div>');
        }
    }, [activeTab, selectedExample, currentScreen]);

    return (
        <Modal
            buttonText="Syntax Examples"
            header={
                <div>
                    <h2>DSL Syntax Reference</h2>
                    <p>Interactive examples of the UI DSL syntax with live preview</p>
                </div>
            }
            content={
                <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSelectedExample(0);
                                }}
                                style={{
                                    backgroundColor: activeTab === tab.id ? '#4a6cf7' : '#e0e0e0',
                                    color: activeTab === tab.id ? 'white' : 'black',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3>{syntaxExamples[activeTab as keyof typeof syntaxExamples].title}</h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                            {syntaxExamples[activeTab as keyof typeof syntaxExamples].examples.map((example, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedExample(index)}
                                    style={{
                                        backgroundColor: selectedExample === index ? '#4a6cf7' : '#e0e0e0',
                                        color: selectedExample === index ? 'white' : 'black',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {example.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <h3>DSL Code</h3>
                            <pre style={{
                                padding: '15px',
                                borderRadius: '5px',
                                height: '300px',
                                overflowY: 'auto',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {syntaxExamples[activeTab as keyof typeof syntaxExamples].examples[selectedExample].code}
                            </pre>
                            <div>
                                <p><strong>Description:</strong> {syntaxExamples[activeTab as keyof typeof syntaxExamples].examples[selectedExample].description}</p>
                            </div>
                        </div>
                        <div>
                            <h3>Compiled Result</h3>
                            <div style={{
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                height: '300px',
                                overflowY: 'auto',
                                padding: '15px',
                            }}
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
                                }}>
                                <div dangerouslySetInnerHTML={{ __html: compiledOutput }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <h3>Syntax Tips</h3>
                        {activeTab === 'layout' && (
                            <ul>
                                <li><strong>Nested Elements:</strong> All layout elements can contain other elements</li>
                            </ul>
                        )}
                        {activeTab === 'input' && (
                            <ul>
                                <li><strong>Input Attributes:</strong> Add HTML attributes like <code>type</code>, <code>placeholder</code>, etc.</li>
                                <li><strong>Checkbox Syntax:</strong> Use <code>[X]</code> for checked and <code>[ ]</code> for unchecked state</li>
                                <li><strong>Radio Syntax:</strong> Use <code>(X)</code> for selected and <code>( )</code> for unselected state</li>
                                <li><strong>Select Options:</strong> Each option is defined with <code>&lt;[Option Text]&gt;</code> syntax</li>
                            </ul>
                        )}
                        {activeTab === 'content' && (
                            <ul>
                                <li><strong>Heading Levels:</strong> Use <code>#</code> for h1, <code>##</code> for h2, etc.</li>
                                <li><strong>Text Styles:</strong> Use <code>&gt;</code> for paragraphs, <code>*&gt;</code> for notes, <code>"&gt;</code> for quotes</li>
                                <li><strong>Button Syntax:</strong> <code>@[Text](action)</code> where action is the function or screen name</li>
                                <li><strong>Link Syntax:</strong> <code>#[Text](destination)</code> where destination is a URL or screen name</li>
                                <li><strong>Image Syntax:</strong> <code>![Alt Text](image-url)</code> similar to Markdown</li>
                            </ul>
                        )}
                    </div>
                </div>
            }
        />
    );
}