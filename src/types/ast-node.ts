export interface BaseAstNode {
  type: string;
  name?: string;
  elements?: AstNode[];
  props?: Record<string, any>;
  attributes?: Record<string, any>;
  modifiers?: {
    width?: string;
    height?: string;
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
    padding?: string;
    paddingX?: string;
    paddingY?: string;
    paddingLeft?: string;
    paddingRight?: string;
    paddingTop?: string;
    paddingBottom?: string;
    margin?: string;
    marginX?: string;
    marginY?: string;
    marginLeft?: string;
    marginRight?: string;
    marginTop?: string;
    marginBottom?: string;
    gap?: string;
    gridCols?: string;
  };
}

export interface ScreenNode extends BaseAstNode {
  type: 'screen';
  name: string;
}

export interface ComponentNode extends BaseAstNode {
  type: 'component';
  name: string;
}

export interface ComponentInstanceNode extends BaseAstNode {
  type: 'component_instance';
  name: string;
}

export interface ModalNode extends BaseAstNode {
  type: 'modal';  name: string;
}

export interface DrawerNode extends BaseAstNode {
  type: 'drawer';
  name: string;
}

export interface ContainerNode extends BaseAstNode {
  type: 'container' | 'grid' | 'flex' | 'card' | 'row' | 'col' | 'section' | 'list';
}

export interface TextNode extends BaseAstNode {
  type: 'text' | 'heading' | 'note' | 'quote';
  props: {
    content: string;
    level?: number;
  };
}

export interface InteractiveNode extends BaseAstNode {
  type: 'button' | 'link' | 'image';
  props: {
    text?: string;
    action?: string;
    destination?: string;
    alt?: string;
    src?: string;
  };
}

export interface FormNode extends BaseAstNode {
  type: 'input' | 'checkbox' | 'radio' | 'select';
  props: {
    label?: string;
    placeholder?: string;
    value?: string;
    checked?: boolean;
    disabled?: boolean;
    password?: boolean;
    options?: string[];
  };
}

export interface MobileNode extends BaseAstNode {
  type: 'header' | 'navigator' | 'drawer' | 'fab' | 'nav_item' | 'drawer_item' | 'fab_item';
  props: {
    icon?: string;
    label?: string;
    action?: string;
  };
}

export interface UtilityNode extends BaseAstNode {
  type: 'Separator' | 'EmptyDiv';
  props: Record<string, any>;
}

export type AstNode = 
  | ScreenNode 
  | ComponentNode   | ComponentInstanceNode
  | ModalNode 
  | DrawerNode
  | ContainerNode
  | TextNode 
  | InteractiveNode 
  | FormNode 
  | MobileNode 
  | UtilityNode
  | BaseAstNode;