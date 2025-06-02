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
    const [copiedCode, setCopiedCode] = useState(false);

    const tabs = [
        { id: 'layout', name: 'Layout', icon: '📐' },
        { id: 'input', name: 'Forms', icon: '📝' },
        { id: 'interactive', name: 'Interactive', icon: '🔘' },
        { id: 'display', name: 'Display', icon: '📊' },
        { id: 'mobile', name: 'Mobile', icon: '📱' },
    ];

    const syntaxExamples = {
        layout: {
            title: "Layout Elements",
            examples: [{
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
            }, {
                name: "List View",
                code: `@screen ListExample:
  list:
    - User Profile
    - Task Status
    - Project Update`,
                description: "Create simple list items using dash-based syntax"
            }, {
                name: "Complex List View",
                code: `@screen ComplexListExample:
  list:
    - [https://placehold.co/50]User Profile{John Doe - Software Engineer}[https://placehold.co/50]
    - [https://placehold.co/50]Task Status{Complete - Review pending}[https://placehold.co/50]
    - [https://placehold.co/50]Project Update{New features added}[https://placehold.co/50]`,
                description: "Create complex list items with images, main text, and subtexts (legacy support)"
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
            examples: [{
                name: "Text Inputs",
                code: `@screen InputExample:
  # Form Fields
  ___:Username(Enter your username)
  ___*:Password(Enter your password)
  ___:Email(Enter your email)
  ___-:Disabled Field(This field is disabled)`,
                description: "Create input fields with labels and placeholders. Use ___* for password fields and ___- for disabled fields"
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
            }, {
                name: "Select Fields",
                code: `@screen SelectExample:
  # Select Menu
  ___:Country(Select your country)[USA | Canada | Mexico | Brazil]
  ___:Language(Choose language)[English | Spanish | French | Portuguese]
  ___-:Disabled Select(Can't change this)[Option 1 | Option 2 | Option 3]`,
                description: "Create dropdown select menus with options using pipe-separated values in brackets. Use ___- for disabled fields"
            }
            ]
        },
        interactive: {
            title: "Interactive Elements",
            examples: [
                {
                    name: "Buttons",
                    code: `@screen ButtonExample:
  # Button Examples
  @[Primary Button]
  @[Secondary Button](action)
  @[Disabled Button]`,
                    description: "Create interactive buttons with optional actions"
                },
                {
                    name: "Links",
                    code: `@screen LinkExample:
  # Link Examples
  #[Internal Link](dashboard-screen)
  #[External Link](https://example.com)
  #[Simple Link Text]`,
                    description: "Create navigational links to screens or external URLs"
                },
                {
                    name: "Images",
                    code: `@screen ImageExample:
  # Image Examples
  ![Profile Picture](https://picsum.photos/200/200)
  ![Banner Image](https://picsum.photos/400/150)
  ![Icon](https://picsum.photos/50/50)`,
                    description: "Add images with alt text and various sizes"
                }
            ]
        },
        display: {
            title: "Display Elements",
            examples: [
                {
                    name: "Typography",
                    code: `@screen TypographyExample:
  # Heading 1
  ## Heading 2
  ### Heading 3
  #### Heading 4
  ##### Heading 5
  ###### Heading 6
  
  > Regular paragraph text
  *> Note styled text with emphasis
  "> Quote styled text for citations`,
                    description: "Display various text styles and heading levels"
                },
                {
                    name: "Progress & Badges",
                    code: `@screen ProgressExample:
  # Progress Indicators
  progress {value: 25}
  progress {value: 50}
  progress {value: 75}
  progress {value: 100}
  
  # Badges
  badge "New"
  badge "Popular"
  badge "Sale"`,
                    description: "Show progress bars and status badges"
                },
                {
                    name: "Lists",
                    code: `@screen ListDisplayExample:
  # Ordered List
  1. First ordered item
  2. Second ordered item
  3. Third ordered item
  
  # Unordered List
  - First unordered item
  - Second unordered item
  - Third unordered item`,
                    description: "Display ordered and unordered lists"
                }
            ]
        },
        mobile: {
            title: "Mobile Components",
            examples: [
                {
                    name: "Header Component",
                    code: `@screen HeaderExample:
  header:
    # App Title
    @[Menu](toggle-drawer)
    @[Profile](profile-screen)
    
  > Content goes here`,
                    description: "Create a fixed header with title and action buttons"
                },
                {
                    name: "Bottom Navigation",
                    code: `@screen BottomNavExample:
  # Main Content
  > App content here
  
  bottom_nav:
    nav_item [Home]{🏠}(home-screen)
    nav_item [Search]{🔍}(search-screen)
    nav_item [Messages]{💬}(messages-screen)
    nav_item [Profile]{👤}(profile-screen)
    nav_item [More]{⋯}(more-screen)`,
                    description: "Create a fixed bottom navigation bar with icons and labels"
                },
                {
                    name: "Drawer/Sidebar",
                    code: `@screen DrawerExample:
  # App Content
  > Main content area
  
  drawer:
    drawer_item [Dashboard]{📊}(dashboard-screen)
    drawer_item [Messages]{💬}(messages-screen)
    drawer_item [Settings]{⚙️}(settings-screen)
    drawer_item [Help]{❓}(help-screen)
    drawer_item [Logout]{🚪}(logout)`,
                    description: "Create a slide-out drawer menu with navigation items"
                }, {
                    name: "Complete Mobile App",
                    code: `@screen MobileDemo:
  header:
    # My App
    @[Menu](toggle-drawer)
    
  card:
    ## Welcome
    > Complete mobile interface example
    
    list:
      - John Doe - Online now
      - Jane Smith - 2 min ago
      - Mike Johnson - 5 min ago
    
  bottom_nav:
    nav_item [Home]{🏠}(home)
    nav_item [Messages]{💬}(messages)
    nav_item [Profile]{👤}(profile)
    
  drawer:
    drawer_item [Settings]{⚙️}(settings)
    drawer_item [Help]{❓}(help)`,
                    description: "A complete mobile app layout with header, content, navigation and drawer"
                }
            ]
        },

    };

    const [selectedExample, setSelectedExample] = useState(0);

    // Copy to clipboard function
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

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
    }, [activeTab, selectedExample, currentScreen]); return (
        <Modal
            buttonText="📚 Syntax Guide"
            buttonVariant="primary"
            header={
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        DSL Syntax Reference
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                        Interactive examples of the UI DSL syntax with live preview
                    </p>
                </div>
            }
            content={
                <div className="space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSelectedExample(0);
                                }}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${activeTab === tab.id
                                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Section Title and Examples */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                                {syntaxExamples[activeTab as keyof typeof syntaxExamples].title}
                            </h3>
                        </div>

                        {/* Example Selection Chips */}
                        <div className="flex flex-wrap gap-2">
                            {syntaxExamples[activeTab as keyof typeof syntaxExamples].examples.map((example, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedExample(index)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedExample === index
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    {example.name}
                                </button>
                            ))}
                        </div>
                    </div>                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">                        {/* DSL Code Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">⚡</span>
                                    <h4 className="text-lg font-semibold text-slate-800 dark:text-white">DSL Code</h4>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(syntaxExamples[activeTab as keyof typeof syntaxExamples].examples[selectedExample].code)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${copiedCode
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                                        }`}
                                >
                                    {copiedCode ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>                            <div className="relative">
                                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto h-96 text-sm font-mono leading-relaxed border border-slate-300 dark:border-slate-600">
                                    <code>{syntaxExamples[activeTab as keyof typeof syntaxExamples].examples[selectedExample].code}</code>
                                </pre>
                                <div className="absolute top-2 right-2">
                                    <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-medium">
                                        DSL
                                    </span>
                                </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                                <div className="flex items-start space-x-2">
                                    <span className="text-blue-500 mt-0.5">💡</span>
                                    <div>
                                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Description</p>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                            {syntaxExamples[activeTab as keyof typeof syntaxExamples].examples[selectedExample].description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Compiled Result Section */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <span className="text-lg">👁️</span>
                                <h4 className="text-lg font-semibold text-slate-800 dark:text-white">Live Preview</h4>
                            </div>                            <div
                                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-4 h-96 overflow-auto shadow-inner"
                                onClick={(e) => {
                                    // Handle navigation with data-nav attributes
                                    const target = (e.target as Element).closest('[data-nav]');
                                    if (target) {
                                        e.preventDefault();

                                        const navValue = target.getAttribute('data-nav');
                                        const navType = target.getAttribute('data-nav-type');

                                        if (navValue && navType === 'internal') {
                                            setCurrentScreen(navValue);
                                            // Hide all screens
                                            const screenElements = document.querySelectorAll('.screen');
                                            screenElements.forEach(screen => {
                                                (screen as HTMLElement).style.display = 'none';
                                            });

                                            // Show the selected screen
                                            const targetScreen = document.getElementById(`${navValue.toLowerCase()}-screen`);
                                            if (targetScreen) {
                                                targetScreen.style.display = 'block';
                                            }
                                        }
                                        return;
                                    }

                                    // Legacy support for data-screen-link
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
                                }}>                                <div dangerouslySetInnerHTML={{ __html: compiledOutput }} />
                            </div>
                        </div>
                    </div>                    {/* Syntax Tips Section */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Syntax Tips</h3>
                        </div>                        {activeTab === 'layout' && (
                            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <div><strong>Nested Elements:</strong> All layout elements can contain other elements</div>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <div><strong>Containers:</strong> Use <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-sm">container:</code>, <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-sm">card:</code>, <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-sm">section:</code> for grouping</div>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <div><strong>Grid System:</strong> Use <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-sm">row:</code> and <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-sm">col:</code> for responsive layouts</div>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <div><strong>Lists:</strong> Use <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-sm">list:</code> with <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-sm">- item</code> syntax for simple lists</div>
                                </li>
                            </ul>
                        )}
                        {activeTab === 'input' && (
                            <ul>
                                <li><strong>Input Types:</strong> Use <code>___*:</code> for password, <code>___-:</code> for disabled fields</li>
                                <li><strong>Checkbox Syntax:</strong> Use <code>[X]</code> for checked and <code>[ ]</code> for unchecked state</li>
                                <li><strong>Radio Syntax:</strong> Use <code>(X)</code> for selected and <code>( )</code> for unselected state</li>
                                <li><strong>Select Options:</strong> Use pipe-separated values: <code>[Option1 | Option2 | Option3]</code></li>
                            </ul>
                        )}
                        {activeTab === 'interactive' && (
                            <ul>
                                <li><strong>Button Syntax:</strong> <code>@[Text](action)</code> where action is optional</li>
                                <li><strong>Link Syntax:</strong> <code>#[Text](destination)</code> for navigation</li>
                                <li><strong>Image Syntax:</strong> <code>![Alt Text](image-url)</code> similar to Markdown</li>
                                <li><strong>Actions:</strong> Use screen names for internal navigation</li>
                            </ul>
                        )}
                        {activeTab === 'display' && (
                            <ul>
                                <li><strong>Heading Levels:</strong> Use <code>#</code> to <code>######</code> for h1-h6</li>
                                <li><strong>Text Styles:</strong> <code>&gt;</code> for paragraphs, <code>*&gt;</code> for notes, <code>"&gt;</code> for quotes</li>
                                <li><strong>Progress:</strong> Use <code>progress {"{value: 75}"}</code> for progress bars</li>
                                <li><strong>Badges:</strong> Use <code>badge "Text"</code> for status indicators</li>
                            </ul>
                        )}
                        {activeTab === 'mobile' && (
                            <ul>
                                <li><strong>Header:</strong> Use <code>header:</code> for fixed top navigation</li>
                                <li><strong>Bottom Nav:</strong> Use <code>bottom_nav:</code> with <code>nav_item</code> elements</li>
                                <li><strong>Drawer:</strong> Use <code>drawer:</code> with <code>drawer_item</code> elements</li>
                                <li><strong>Icons:</strong> Use emoji or text within curly braces: <code>{"{🏠}"}</code></li>
                            </ul>
                        )}

                    </div>
                </div>
            }
        />
    );
}