import type { AstNode, ViewProps } from '../../types/ast-node.js'
import {
  elementStyles,
  getScreenClasses,
  getModalContentInlineStyles,
  getModalCloseInlineStyles,
  getDrawerInlineStyles,
} from './styles/styles.js'

/**
 * @function renderScreen
 * @description Renders a 'Screen' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Screen' AST node.
 * @param {(node: AstNode, context?: string) => string} nodeRenderer - The main node renderer function.
 * @returns {string} The HTML string for the screen.
 */
export function renderScreen(
  node: AstNode,
  nodeRenderer: (node: AstNode, context?: string) => string
): string {
  const screenName = (node.props as ViewProps).name || 'default'
  const screenClasses = getScreenClasses([screenName])

  // Check if screen has header or navigator to add appropriate padding
  const hasHeader = node.children?.some(child =>
    child.type === 'Layout' && (child.props as any)?.layoutType === 'header'
  )
  const hasNavigator = node.children?.some(child => child.type === 'Navigator')
  const hasFab = node.children?.some(child => child.type === 'Fab')

  let paddingClasses = ''
  if (hasHeader) paddingClasses += ' pt-16' // Add top padding for header
  if (hasNavigator) paddingClasses += ' pb-16' // Add bottom padding for navigator
  else if (hasFab) paddingClasses += ' pb-24' // Add more bottom padding for FAB

  const screenElements = node.children
    ? node.children.map((child) => nodeRenderer(child, 'screen')).join('\n')
    : ''

  return `<div class="${screenClasses}${paddingClasses}" data-screen="${screenName}">${screenElements}</div>`
}

/**
 * @function renderModal
 * @description Renders a 'Modal' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Modal' AST node.
 * @param {string} [context] - The rendering context.
 * @param {(node: AstNode, context?: string) => string} [nodeRenderer] - The main node renderer function.
 * @returns {string} The HTML string for the modal.
 */
export function renderModal(
  node: AstNode,
  context?: string,
  nodeRenderer?: (node: AstNode, context?: string) => string
): string {
  const modalElements =
    node.children && nodeRenderer
      ? node.children.map((child) => nodeRenderer(child, context)).join('\n')
      : ''

  const modalName = (node.props as ViewProps).name || 'modal'

  return `<div class="modal hidden" id="modal-${modalName}" data-modal="${modalName}">
    <div class="${elementStyles.modalBackdrop}" >
      <div class="${elementStyles.modalContent}" style="${getModalContentInlineStyles()}" >
        <button class="${elementStyles.modalClose}" style="${getModalCloseInlineStyles()}" data-nav="${modalName}" data-nav-type="toggle">&times;</button>
        ${modalElements}
      </div>
    </div>
  </div>`
}

/**
 * @function renderDrawer
 * @description Renders a 'Drawer' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Drawer' AST node.
 * @param {string} [context] - The rendering context.
 * @param {(node: AstNode, context?: string) => string} [nodeRenderer] - The main node renderer function.
 * @returns {string} The HTML string for the drawer.
 */
export function renderDrawer(
  node: AstNode,
  context?: string,
  nodeRenderer?: (node: AstNode, context?: string) => string
): string {
  const drawerName = (node.props as ViewProps).name

  // Only handle named drawers (modern pattern)
  if (!drawerName) {
    console.warn(
      'Drawer element requires a name. Legacy unnamed drawers are deprecated.'
    )
    return ''
  }

  const drawerElements =
    node.children && nodeRenderer
      ? node.children.map((child) => nodeRenderer(child, context)).join('\n')
      : ''

  return `<div class="drawer-container hidden" id="drawer-${drawerName}" data-drawer="${drawerName}">
    <div class="drawer-overlay backdrop-blur-sm absolute inset-0 bg-black/30 z-[1040]"></div>
    <aside class="${elementStyles.drawer} z-[1050]" style="${getDrawerInlineStyles()}">
      <div class="p-4">
        <button class="${elementStyles.modalClose}" style="${getModalCloseInlineStyles()}" data-nav="${drawerName}" data-nav-type="toggle">&times;</button>
        ${drawerElements}
      </div>
    </aside>
  </div>`
}
