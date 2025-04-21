import { createElement } from 'react';

export interface AstNode {
  type: string;
  name?: string;
  elements?: AstNode[];
  props?: Record<string, any>;
}

function transformToReactElement(node: AstNode): React.ReactElement | null {
  if (!node || !node.type) {
    console.warn('Invalid node received:', node);
    return null;
  }

  switch (node.type) {
    case 'Screen':
      return createElement(
        'div',
        { className: `screen ${node.name?.toLowerCase()}` },
        node.elements?.filter(element => element != null)
          .map((element) => transformToReactElement(element))
          .filter(Boolean)
      );

    case 'Input':
      return createElement('input', {
        key: Math.random(),
        ...node.props
      });

    case 'Button':
      return createElement(
        'button',
        {
          key: Math.random(),
          ...node.props
        },
        node.props?.children
      );

    case 'Heading':
      return createElement(
        `h${node.props?.level}`,
        {
          key: Math.random()
        },
        node.props?.children
      );

    case 'Link':
      return createElement(
        'a',
        {
          key: Math.random(),
          href: node.props?.href,
          target: "_blank",
          rel: "noopener noreferrer"
        },
        node.props?.children
      );

    case 'Image':
      return createElement(
        'img',
        {
          key: Math.random(),
          src: node.props?.src,
          alt: node.props?.alt || '',
          style: { maxWidth: '100%' }
        }
      );

    case 'OrderedList':
      return createElement(
        'ol',
        { key: Math.random() },
        node.props?.items.map((item: string, index: number) =>
          createElement('li', { key: index }, item)
        )
      );

    case 'UnorderedList':
      return createElement(
        'ul',
        { key: Math.random() },
        node.props?.items.map((item: string, index: number) =>
          createElement('li', { key: index }, item)
        )
      );

    case 'Paragraph':
      const styles = {
        default: {
          margin: '1em 0',
          lineHeight: '1.6'
        },
        note: {
          margin: '1em 0',
          padding: '1em',
        },
        quote: {
          margin: '1em 0',
          padding: '1em',
          backgroundColor: '#f8f9fa',
          borderLeft: '4px solid #34495e',
          fontStyle: 'italic',
          color: '#2c3e50'
        }
      };      return createElement(
        'p',
        {
          key: Math.random(),
          style: styles[node.props?.variant as keyof typeof styles || 'default']
        },
        node.props?.children
      );

    case 'RadioGroup':
      const name = Math.random().toString(36).substring(7);
      return createElement(
        'div',
        { key: Math.random(), className: 'radio-group' },
        node.props?.options.map((option: { label: string, selected: boolean }, index: number) =>
          createElement('label', 
            { 
              key: index,
              style: { display: 'block', marginBottom: '8px' }
            },
            [
              createElement('input', {
                key: `radio-input-${index}`,
                type: 'radio',
                name: name,
                defaultChecked: option.selected,
                style: { marginRight: '8px' }
              }),
              createElement('span', { key: `radio-label-${index}` }, option.label)
            ]
          )
        )
      );    case 'Select':
      if (!node.props?.options?.length) {
        console.warn('No select options provided:', node);
        return null;
      }
      return createElement(
        'select',
        {
          key: `select-${Math.random()}`,
          style: { 
            width: '100%',
            padding: '8px',
            marginBottom: '16px',
            borderRadius: '4px'
          }
        },
        node.props.options.map((option: string, index: number) =>
          createElement('option', {
            key: `option-${index}`,
            value: option
          }, option)
        )
      );

    case 'CheckboxGroup':
      if (!node.props?.options?.length) {
        console.warn('No checkbox options provided:', node);
        return null;
      }
      return createElement(
        'fieldset',
        { 
          key: `checkbox-group-${Math.random()}`, 
          className: 'checkbox-group',
          style: { border: 'none', padding: 0, margin: '8px 0' }
        },
        node.props.options.map((option: { label: string, checked: boolean }, index: number) =>
          createElement('label',
            {
              key: `checkbox-${index}`,
              style: { 
                display: 'block', 
                marginBottom: '8px',
                cursor: 'pointer'
              }
            },
            [
              createElement('input', {
                key: `checkbox-input-${index}`,
                type: 'checkbox',
                defaultChecked: option.checked,
                style: { 
                  marginRight: '8px',
                  cursor: 'pointer'
                }
              }),
              createElement('span', { 
                key: `checkbox-label-${index}`,
                style: { userSelect: 'none' }
              }, option.label)
            ]
          )
        )
      );

    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function createScreenComponent(node: AstNode): React.ReactElement {
  return createElement(
    'div',
    { 
      key: `screen-${node.name}`,
      className: `screen ${node.name?.toLowerCase()}` 
    },
    node.elements?.map((element, index) => {
      const elementWithKey = transformToReactElement(element);
      return elementWithKey ? createElement(
        'div',
        { key: `element-${index}` },
        elementWithKey
      ) : null;
    }).filter(Boolean)
  );
}

// Define a stack-based navigation system
const navigationStack: string[] = [];

function pushToStack(screenName: string) {
  console.log('Button clicked:', screenName);
  navigationStack.push(screenName);
  console.log('Updated Navigation Stack:', navigationStack);
  renderCurrentScreen();
}

function renderCurrentScreen() {
  const currentScreen = navigationStack[navigationStack.length - 1];
  const screenElement = document.getElementById(currentScreen);

  console.log('Navigation Stack:', navigationStack);
  console.log('Rendering Current Screen:', navigationStack[navigationStack.length - 1]);

  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  // Show the current screen
  if (screenElement) {
    screenElement.classList.add('active');
  }
}

export function astToReact(ast: AstNode | AstNode[]): React.ReactElement {
  if (Array.isArray(ast)) {
    // Filter out any invalid screens and create navigation buttons
    const validScreens = ast.filter(screen => screen && screen.type === 'Screen' && screen.name);
    const navigationButtons = validScreens.map(screen =>
      createElement(
        'button',
        {
          key: screen.name,
          onClick: () => pushToStack(screen.name || ''),
          style: { marginRight: 10 }
        },
        screen.name
      )
    );    // Create screen elements
    const screens = validScreens.map(screen =>
      createElement(
        'div',
        {
          id: screen.name?.toLowerCase(),
          className: `screen ${navigationStack[0] === screen.name ? 'active' : ''}`,
          style: { display: navigationStack[0] === screen.name ? 'block' : 'none' },
          key: screen.name
        },
        screen.elements?.filter(element => element != null)
          .map(element => transformToReactElement(element))
          .filter(Boolean)
      )
    );

    // Initialize the stack with the first screen
    if (navigationStack.length === 0 && validScreens.length > 0) {
      navigationStack.push(validScreens[0].name || '');
      renderCurrentScreen();
    }

    // Ensure the first screen is visible on initialization
    if (navigationStack.length === 1) {
      const firstScreenElement = document.getElementById(navigationStack[0]);
      if (firstScreenElement) {
        firstScreenElement.classList.add('active');
      }
    }    return createElement(
      'div',
      { key: 'root-container' },
      [
        createElement('div', { key: 'nav-container', style: { marginBottom: 20 } }, navigationButtons),
        ...screens
      ]
    );
  }

  // If we receive a single screen
  return ast && ast.type === 'Screen' ? createScreenComponent(ast) : createElement('div', null, 'Invalid screen data');
}
