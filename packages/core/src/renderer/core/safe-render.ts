// ============================================================
// SAFE RENDER - Wrapper de Segurança para Renderização
// ============================================================
// Garante que erros em nós individuais não derrubem a renderização completa
// Implementa graceful degradation com error recovery

import { AstNode } from '../../types/ast-node'
import {
  ERROR_CODES,
  ProtoError,
  sanitizeErrorMessage,
} from '../../types/errors'

// ============================================================
// Safe Render Function
// ============================================================

/**
 * Envolve função de renderização em try/catch de segurança
 *
 * - Se renderização OK: retorna HTML normalmente
 * - Se erro: captura, sanitiza, coleta erro e retorna string vazia
 * - NUNCA deixa erro de nó individual derrubar renderização completa
 *
 * @param renderFn Função que renderiza um nó específico
 * @param node Nó AST a ser renderizado
 * @param collected Array para coletar erros durante renderização
 * @returns HTML string (ou vazio se erro)
 *
 * @example
 * const html = safeRender(renderButton, buttonNode, errors);
 */
export function safeRender(
  renderFn: (node: AstNode) => string,
  node: AstNode,
  collected: ProtoError[]
): string {
  try {
    // Tenta renderizar normalmente
    return renderFn(node)
  } catch (error: unknown) {
    // ========================================================
    // ERROR HANDLING: Captura e sanitiza erro
    // ========================================================
    const sanitized = sanitizeErrorMessage(error)

    // Coleta erro para ErrorBus
    const rendererError: ProtoError = {
      stage: 'renderer',
      code: ERROR_CODES.REND_GENERIC_ERROR,
      message: `Failed to render ${node.type} node`,
      hint: sanitized,
      severity: 'warning', // warning = nó ignorado, app continua
      nodeType: node.type,
      nodeId: node.id,
      recoverable: true,
      // Localização (se disponível no node)
      line: (node as AstNode & { line?: number }).line,
      column: (node as AstNode & { column?: number }).column,
    }

    collected.push(rendererError)

    // Retorna vazio para este nó (não quebra layout)
    // Preview renderiza resto normalmente
    return ''
  }
}

// ============================================================
// Recursive Safe Render
// ============================================================

/**
 * Renderiza array de nós filhos com segurança
 * Continua renderizando mesmo se alguns nós falharem
 *
 * @param nodes Array de nós filhos
 * @param renderFn Função de renderização
 * @param collected Array de erros
 * @returns HTML concatenado de todos os nós (ignorando falhas)
 */
export function safeRenderChildren(
  nodes: AstNode[],
  renderFn: (node: AstNode) => string,
  collected: ProtoError[]
): string {
  return nodes
    .map((node) => safeRender(renderFn, node, collected))
    .filter((html) => html.length > 0) // Remove strings vazias (erros)
    .join('')
}

// ============================================================
// Safe Render with Fallback
// ============================================================

/**
 * Renderiza com fallback customizado em caso de erro
 * Útil para components críticos que precisam mostrar algo
 *
 * @param renderFn Função de renderização
 * @param node Nó a renderizar
 * @param fallback HTML a retornar em caso de erro
 * @param collected Array de erros
 * @returns HTML renderizado ou fallback
 */
export function safeRenderWithFallback(
  renderFn: (node: AstNode) => string,
  node: AstNode,
  fallback: string,
  collected: ProtoError[]
): string {
  try {
    return renderFn(node)
  } catch (error: unknown) {
    const sanitized = sanitizeErrorMessage(error)

    collected.push({
      stage: 'renderer',
      code: ERROR_CODES.REND_GENERIC_ERROR,
      message: `Failed to render ${node.type}, using fallback`,
      hint: sanitized,
      severity: 'warning',
      nodeType: node.type,
      nodeId: node.id,
      recoverable: true,
    })

    return fallback
  }
}

// ============================================================
// Validation Helpers
// ============================================================

/**
 * Valida se nó tem propriedades necessárias antes de renderizar
 * Previne erros comuns (props undefined, children null, etc)
 */
export function validateNode(node: AstNode, collected: ProtoError[]): boolean {
  if (!node) {
    collected.push({
      stage: 'renderer',
      code: ERROR_CODES.REND_GENERIC_ERROR,
      message: 'Received null or undefined node',
      severity: 'error',
      recoverable: false,
    })
    return false
  }

  if (!node.type) {
    collected.push({
      stage: 'renderer',
      code: ERROR_CODES.REND_GENERIC_ERROR,
      message: 'Node missing type property',
      severity: 'error',
      nodeId: node.id,
      recoverable: false,
    })
    return false
  }

  return true
}

/**
 * Valida props de um nó antes de usar
 * Retorna props default se inválido
 */
export function validateProps<T extends Record<string, unknown>>(
  node: AstNode,
  defaultProps: T,
  collected: ProtoError[]
): T {
  if (!node.props || typeof node.props !== 'object') {
    collected.push({
      stage: 'renderer',
      code: ERROR_CODES.REND_GENERIC_ERROR,
      message: `Node ${node.type} missing props, using defaults`,
      severity: 'info',
      nodeType: node.type,
      nodeId: node.id,
      recoverable: true,
    })
    return defaultProps
  }

  return { ...defaultProps, ...node.props } as T
}
