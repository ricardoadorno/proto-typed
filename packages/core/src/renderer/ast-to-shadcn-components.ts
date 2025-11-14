/**
 * AST to Shadcn Components Exporter
 * Converts proto-typed AST to React components using shadcn/ui
 */

import { AstNode } from "../types/ast-node.js";
import { ImportManager } from "./shadcn/import-manager.js";
import { ShadcnNodeRenderer } from "./shadcn/shadcn-node-renderer.js";
import { CodeGenerator } from "./shadcn/code-generator.js";
import { ShadcnExportResult, NavigationConfig, RouteConfig } from "./shadcn/types.js";

interface ComponentExport {
  name: string;
  code: string;
  imports: string;
}

/**
 * Main export function - converts AST to shadcn/ui React components
 */
export function astToShadcnComponents(
  ast: AstNode[],
  options: {
    themeName?: string;
    defaultScreen?: string;
  } = {}
): ShadcnExportResult {
  const { themeName = "zinc", defaultScreen } = options;

  // Separate screens from other nodes
  const screens = ast.filter((node) => node.type === "Screen");
  const globalNodes = ast.filter((node) => node.type !== "Screen");

  // Process each screen as a separate component
  const components: ComponentExport[] = [];
  const routes: RouteConfig[] = [];
  const modals: string[] = [];
  const drawers: string[] = [];

  screens.forEach((screenNode, index) => {
    const structuralProps = screenNode.props as any;
    const screenName = structuralProps?.name || `Screen${index + 1}`;
    const importManager = new ImportManager();

    // Add navigation imports
    importManager.addImport('import { useNavigate } from "react-router-dom"');

    // Create renderer for this screen
    const renderer = new ShadcnNodeRenderer(importManager);

    // Render the screen and its children
    const screenCode = renderer.render(screenNode, {
      componentName: screenName,
      isRootComponent: true,
    });

    // Generate imports
    const imports = importManager.generateImports();

    components.push({
      name: screenName,
      code: screenCode,
      imports,
    });

    // Add to routes
    const path = `/${screenName.toLowerCase()}`;
    const isDefault = defaultScreen
      ? screenName === defaultScreen
      : index === 0;

    routes.push({
      path,
      componentName: screenName,
      isDefault,
    });
  });

  // Process modals and drawers from global nodes
  globalNodes.forEach((node) => {
    if (node.type === "Modal") {
      const props = node.props as any;
      modals.push(props?.name || "Modal");
    } else if (node.type === "Drawer") {
      const props = node.props as any;
      drawers.push(props?.name || "Drawer");
    }
  });

  // Create navigation config
  const navigationConfig: NavigationConfig = {
    routes,
    modals,
    drawers,
  };

  // Generate all project files
  const result = CodeGenerator.generate(
    components,
    navigationConfig,
    themeName
  );

  return result;
}

/**
 * Helper to generate a single component (for testing)
 */
export function generateSingleComponent(
  node: AstNode,
  componentName: string = "Component"
): string {
  const importManager = new ImportManager();
  importManager.addImport('import { useNavigate } from "react-router-dom"');

  const renderer = new ShadcnNodeRenderer(importManager);
  const code = renderer.render(node, {
    componentName,
    isRootComponent: true,
  });

  const imports = importManager.generateImports();

  return `${imports}

${code}`;
}

/**
 * Helper to get required shadcn components for installation
 */
export function getRequiredShadcnComponents(ast: AstNode[]): string[] {
  const importManager = new ImportManager();
  const renderer = new ShadcnNodeRenderer(importManager);

  // Render all nodes to collect imports
  ast.forEach((node) => {
    renderer.render(node, {});
  });

  return importManager.getAllComponents();
}
