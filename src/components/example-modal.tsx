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

    const tabs = [
        { id: 'layout', name: 'Layout', icon: '📐' },
        { id: 'input', name: 'Forms', icon: '📝' },
        { id: 'interactive', name: 'Interactive', icon: '🔘' },
        { id: 'display', name: 'Display', icon: '📊' },
        { id: 'mobile', name: 'Mobile', icon: '📱' },
        { id: 'navigation', name: 'Navigation', icon: '🧭' },
        { id: 'styling', name: 'Styling', icon: '🎨' }
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
  ___-:Disabled Select(Can't change this)[Option 1 | Option 2 | Option 3]
  
  # Legacy Select Syntax
  <[Legacy Option 1]>
  <[Legacy Option 2]>`,
                description: "Create dropdown select menus with options using pipe-separated values in brackets. Use ___- for disabled fields"
            },
            ]
        }, content: {
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
                },
                {
                    name: "Complete Mobile App", code: `@screen MobileDemo:
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
    drawer_item [Help]{❓}(help)`, description: "A complete mobile app layout with header, content, navigation and drawer"
                }
            ]
        }
    };

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
                            }} onClick={(e) => {
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