/**
 * Shadcn renderers for view nodes (Screen, Modal, Drawer)
 */

import { AstNode } from "../../../types/ast-node.js";
import { ImportManager } from "../import-manager.js";
import { ShadcnRenderContext } from "../types.js";

export function renderScreen(
  node: AstNode,
  childrenCode: string,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const structuralProps = node.props as any;
  const screenName = structuralProps?.name || context.componentName || "Screen";

  // Screens are rendered as separate component files
  // This returns the main component structure
  return `export function ${screenName}() {
  return (
    <div className="min-h-screen bg-background">
      ${childrenCode}
    </div>
  )
}`;
}

export function renderModal(
  node: AstNode,
  childrenCode: string,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  importManager.addShadcnComponents([
    "Dialog",
    "DialogContent",
    "DialogDescription",
    "DialogHeader",
    "DialogTitle",
    "DialogTrigger",
  ]);
  importManager.addShadcnComponent("Button");

  const structuralProps = node.props as any;
  const modalName = structuralProps?.name || "Modal";
  const title = structuralProps?.title || modalName;
  const description = structuralProps?.description || "";
  const triggerText = structuralProps?.trigger || `Open ${modalName}`;

  // Extract content from children
  return `<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">${triggerText}</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>${title}</DialogTitle>
      ${description ? `<DialogDescription>${description}</DialogDescription>` : ""}
    </DialogHeader>
    ${childrenCode}
  </DialogContent>
</Dialog>`;
}

export function renderDrawer(
  node: AstNode,
  childrenCode: string,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  importManager.addShadcnComponents([
    "Sheet",
    "SheetContent",
    "SheetDescription",
    "SheetHeader",
    "SheetTitle",
    "SheetTrigger",
  ]);
  importManager.addShadcnComponent("Button");

  const structuralProps = node.props as any;
  const drawerName = structuralProps?.name || "Drawer";
  const title = structuralProps?.title || drawerName;
  const description = structuralProps?.description || "";
  const triggerText = structuralProps?.trigger || `Open ${drawerName}`;
  const side = structuralProps?.side || "right";

  return `<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">${triggerText}</Button>
  </SheetTrigger>
  <SheetContent side="${side}">
    <SheetHeader>
      <SheetTitle>${title}</SheetTitle>
      ${description ? `<SheetDescription>${description}</SheetDescription>` : ""}
    </SheetHeader>
    ${childrenCode}
  </SheetContent>
</Sheet>`;
}
