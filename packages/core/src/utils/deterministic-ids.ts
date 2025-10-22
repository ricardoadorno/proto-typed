import { AstNode } from '@shared'; //ast-node';

/**
 * Generate a deterministic hash from a string
 */
function generateHash(input: string): string {
  let hash = 0;
  if (input.length === 0) return '0';
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to positive base36 string (6 characters)
  const hashStr = Math.abs(hash).toString(36);
  return hashStr.padStart(6, '0').substring(0, 6);
}

/**
 * Extract stable properties from node props for fingerprinting
 */
function extractStableProps(props: any): string {
  if (!props) return '';
  
  const stableFields: string[] = [];
  
  // Extract stable fields in order of preference
  if (props.name) stableFields.push(`name=${props.name}`);
  if (props.label) stableFields.push(`label=${props.label}`);
  if (props.componentName) stableFields.push(`componentName=${props.componentName}`);
  if (props.text) stableFields.push(`text=${props.text}`);
  if (props.content) stableFields.push(`content=${props.content}`);
  if (props.children) stableFields.push(`children=${props.children}`);
  
  return stableFields.join('|');
}

/**
 * Generate a semantic fingerprint for a node
 */
function generateFingerprint(node: AstNode, parentType?: string): string {
  const stableProps = extractStableProps(node.props);
  const parentPart = parentType ? `parent=${parentType}` : '';
  
  const parts = [`type=${node.type}`, stableProps, parentPart].filter(Boolean);
  return parts.join('|');
}

/**
 * Generate a deterministic ID for a node
 */
function generateNodeId(node: AstNode, parentType?: string): string {
  const fingerprint = generateFingerprint(node, parentType);
  const hash = generateHash(fingerprint);
  const typeLowerCase = node.type ? String(node.type).toLowerCase() : 'unknown';
  
  return `${typeLowerCase}_${hash}`;
}

/**
 * Handle duplicate IDs among siblings by adding ordinal suffixes
 */
function resolveDuplicateIds(nodes: AstNode[]): void {
  const idCounts = new Map<string, number>();
  
  for (const node of nodes) {
    if (!node.id) continue;
    
    const baseId = node.id;
    const currentCount = idCounts.get(baseId) || 0;
    idCounts.set(baseId, currentCount + 1);
    
    if (currentCount > 0) {
      node.id = `${baseId}~${currentCount + 1}`;
    }
  }
}

/**
 * Reuse existing IDs from previous AST when nodes are semantically identical
 */
function reuseExistingIds(newAst: AstNode, previousAst?: AstNode): void {
  if (!previousAst) return;
  
  // Create a map of fingerprints to IDs from previous AST
  const fingerprintToId = new Map<string, string>();
  
  function collectIds(node: AstNode): void {
    if (node.id) {
      const fingerprint = generateFingerprint(node);
      fingerprintToId.set(fingerprint, node.id);
    }
    
    if (node.children) {
      node.children.forEach(collectIds);
    }
  }
  
  collectIds(previousAst);
  
  // Apply existing IDs to matching nodes in new AST
  function applyExistingIds(node: AstNode): void {
    const fingerprint = generateFingerprint(node);
    const existingId = fingerprintToId.get(fingerprint);
    
    if (existingId) {
      node.id = existingId;
    }
    
    if (node.children) {
      node.children.forEach(applyExistingIds);
    }
  }
  
  applyExistingIds(newAst);
}

/**
 * Generate IDs for all nodes in an AST recursively
 */
function generateIdsRecursive(node: AstNode, parentType?: string): void {
  // Only generate ID if not already present
  if (!node.id) {
    node.id = generateNodeId(node, parentType);
  }
  
  if (node.children && node.children.length > 0) {
    // First pass: generate IDs for all children
    for (const child of node.children) {
      generateIdsRecursive(child, node.type);
    }
    
    // Second pass: resolve duplicate IDs among siblings
    resolveDuplicateIds(node.children);
  }
}

/**
 * Main function to generate deterministic IDs for an AST
 * 
 * @param ast - The AST to process (can be a single node or array of nodes)
 * @param previousAst - Optional previous AST for ID reuse
 * @returns The AST with all nodes having deterministic IDs
 */
export function generateDeterministicIds(ast: AstNode | AstNode[], previousAst?: AstNode | AstNode[]): AstNode | AstNode[] {
  // Handle array case
  if (Array.isArray(ast)) {
    const astCopy = JSON.parse(JSON.stringify(ast));
    
    // Apply ID generation to each root node
    for (let i = 0; i < astCopy.length; i++) {
      // Try to find corresponding previous node for ID reuse
      const previousNode = Array.isArray(previousAst) && previousAst[i] ? previousAst[i] : undefined;
      
      if (previousNode) {
        reuseExistingIds(astCopy[i], previousNode);
      }
      
      generateIdsRecursive(astCopy[i]);
    }
    
    return astCopy;
  }
  
  // Handle single node case
  const astCopy = JSON.parse(JSON.stringify(ast));
  
  // First, try to reuse existing IDs from previous AST
  if (previousAst && !Array.isArray(previousAst)) {
    reuseExistingIds(astCopy, previousAst);
  }
  
  // Generate IDs for any nodes that don't have them
  generateIdsRecursive(astCopy);
  
  return astCopy;
}

/**
 * Utility function to validate that all nodes in an AST have IDs
 */
export function validateAstIds(ast: AstNode | AstNode[]): boolean {
  function checkNode(node: AstNode): boolean {
    if (!node.id) {
      console.warn(`Node of type ${node.type} is missing an ID`);
      return false;
    }
    
    if (node.children) {
      return node.children.every(checkNode);
    }
    
    return true;
  }
  
  if (Array.isArray(ast)) {
    return ast.every(checkNode);
  }
  
  return checkNode(ast);
}

/**
 * Utility function to get all IDs in an AST (for debugging)
 */
export function getAllIds(ast: AstNode | AstNode[]): string[] {
  const ids: string[] = [];
  
  function collectIds(node: AstNode): void {
    if (node.id) {
      ids.push(node.id);
    }
    
    if (node.children) {
      node.children.forEach(collectIds);
    }
  }
  
  if (Array.isArray(ast)) {
    ast.forEach(collectIds);
  } else {
    collectIds(ast);
  }
  
  return ids;
}