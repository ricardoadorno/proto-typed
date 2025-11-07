import { AstNode } from '../../../types/ast-node';
import { ImportManager } from '../infrastructure/import-manager';

/**
 * Convert Button AST node to shadcn Button component
 */
export function redeemButton(node: AstNode, importManager: ImportManager): string {
  const props = node.props as any;
  const { text = '', action, variant = 'default', icon, size } = props;

  // Add Button to imports
  importManager.addShadcnComponent('Button');

  // Map variants to shadcn button variants
  const variantMap: Record<string, string> = {
    'primary': 'default',
    'secondary': 'secondary',
    'danger': 'destructive',
    'ghost': 'ghost',
    'outline': 'outline',
  };
  const shadcnVariant = variantMap[variant] || 'default';

  // Build props
  const buttonProps: string[] = [];
  if (shadcnVariant !== 'default') {
    buttonProps.push(`variant="${shadcnVariant}"`);
  }
  if (size) {
    buttonProps.push(`size="${size}"`);
  }

  // Handle action/navigation
  if (action) {
    const actionProps = parseAction(action, importManager);
    buttonProps.push(...actionProps);
  }

  const propsString = buttonProps.length > 0 ? ' ' + buttonProps.join(' ') : '';

  // Handle icon
  let content = text;
  if (icon) {
    const iconName = convertLucideIconName(icon);
    importManager.addLucideIcon(iconName);
    content = text ? `<${iconName} className="mr-2 h-4 w-4" /> ${text}` : `<${iconName} className="h-4 w-4" />`;
  }

  return `<Button${propsString}>${content}</Button>`;
}

/**
 * Convert Link AST node to Next.js Link component
 */
export function redeemLink(node: AstNode, importManager: ImportManager): string {
  const props = node.props as any;
  const { text = '', destination = '#' } = props;

  // Check if internal or external link
  if (destination.startsWith('http://') || destination.startsWith('https://')) {
    // External link
    return `<a href="${destination}" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">${text}</a>`;
  } else {
    // Internal link - use Next.js Link
    importManager.addNextImport('Link');
    return `<Link href="${destination}" className="text-primary hover:underline">${text}</Link>`;
  }
}

/**
 * Convert Image AST node to Next.js Image component
 */
export function redeemImage(node: AstNode, importManager: ImportManager): string {
  const props = node.props as any;
  const { src = '', alt = '' } = props;

  // Use Next.js Image for optimization
  importManager.addNextImport('Image');

  return `<Image src="${src}" alt="${alt}" width={500} height={300} className="rounded-lg" />`;
}

/**
 * Convert Heading AST node to semantic heading
 */
export function redeemHeading(node: AstNode): string {
  const props = node.props as any;
  const { level = 1, content = '' } = props;

  // Map heading levels to Tailwind classes
  const headingClasses: Record<number, string> = {
    1: 'text-4xl font-bold tracking-tight',
    2: 'text-3xl font-semibold tracking-tight',
    3: 'text-2xl font-semibold tracking-tight',
    4: 'text-xl font-semibold',
    5: 'text-lg font-semibold',
    6: 'text-base font-semibold',
  };

  const className = headingClasses[level] || headingClasses[1];
  return `<h${level} className="${className}">${content}</h${level}>`;
}

/**
 * Convert Text/MutedText AST node to span
 */
export function redeemText(node: AstNode): string {
  const props = node.props as any;
  const { content = '', variant } = props;

  const isMuted = node.type === 'MutedText' || variant === 'muted';
  const className = isMuted ? 'text-muted-foreground' : '';

  return className
    ? `<span className="${className}">${content}</span>`
    : `<span>${content}</span>`;
}

/**
 * Convert Paragraph AST node to p element
 */
export function redeemParagraph(node: AstNode): string {
  const props = node.props as any;
  const { content = '', variant } = props;

  const className = variant === 'muted' ? 'text-muted-foreground' : '';

  return className
    ? `<p className="${className}">${content}</p>`
    : `<p>${content}</p>`;
}

/**
 * Parse action string and return appropriate props
 */
function parseAction(action: string, importManager: ImportManager): string[] {
  const props: string[] = [];

  // Navigation patterns
  if (action.startsWith('@')) {
    // Screen navigation - would need state management
    const screenName = action.substring(1);
    props.push(`onClick={() => navigateTo('${screenName}')}`);
    importManager.addReactImport('useState');
  } else if (action === 'back') {
    props.push(`onClick={() => window.history.back()}`);
  } else if (action.startsWith('http://') || action.startsWith('https://')) {
    props.push(`onClick={() => window.open('${action}', '_blank')}`);
  } else {
    // Generic action
    props.push(`onClick={() => console.log('${action}')}`);
  }

  return props;
}

/**
 * Convert icon name from DSL format to Lucide component name
 */
function convertLucideIconName(iconName: string): string {
  // Remove 'i-' prefix if present
  const name = iconName.replace(/^i-/, '');

  // Convert kebab-case to PascalCase
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
