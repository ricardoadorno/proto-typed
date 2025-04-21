export interface AstNode {
  type: string;
  name?: string;
  elements?: AstNode[];
  props?: Record<string, any>;
}