/**
 * Shadcn renderers for layout nodes
 */

import { AstNode } from "../../types/ast-node";
import { ImportManager } from "../import-manager";
import { ShadcnRenderContext } from "../types";

/**
 * Layout presets mapping to Tailwind classes
 */
const LAYOUT_PRESETS: Record<string, string> = {
  // Containers
  container: "max-w-5xl mx-auto px-4",
  "container-narrow": "max-w-2xl mx-auto px-4",
  "container-wide": "max-w-7xl mx-auto px-6",
  "container-full": "w-full",

  // Stacks (Vertical)
  stack: "flex flex-col gap-4",
  "stack-tight": "flex flex-col gap-2",
  "stack-loose": "flex flex-col gap-8",

  // Rows (Horizontal)
  "row-start": "flex items-center gap-4",
  "row-center": "flex items-center justify-center gap-4",
  "row-between": "flex items-center justify-between",
  "row-end": "flex items-center justify-end gap-4",

  // Grids
  "grid-2": "grid grid-cols-2 gap-4",
  "grid-3": "grid grid-cols-3 gap-4",
  "grid-4": "grid grid-cols-4 gap-4",
  "grid-auto": "grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4",

  // Cards
  card: "border rounded-lg p-6",
  "card-compact": "border rounded-lg p-4",
  "card-feature": "border-2 rounded-xl p-8 shadow-lg",

  // Special
  header: "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
  sidebar: "h-full fixed left-0 top-0 border-r p-4 pt-8 w-64",
  footer: "border-t py-6 md:py-0",
};

export function renderLayout(
  node: AstNode,
  childrenCode: string,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const layoutProps = node.props as any;
  const preset = layoutProps?.layoutType || layoutProps?.preset || "stack";
  const isCard = preset.includes("card");

  // If it's a card preset, use Card component
  if (isCard) {
    importManager.addShadcnComponents(["Card", "CardContent"]);

    const className = LAYOUT_PRESETS[preset] || LAYOUT_PRESETS.card;

    return `<Card className="${className}">
  <CardContent className="pt-6">
    ${childrenCode}
  </CardContent>
</Card>`;
  }

  // Otherwise, use a div with the preset classes
  const className = LAYOUT_PRESETS[preset] || LAYOUT_PRESETS.stack;

  return `<div className="${className}">
  ${childrenCode}
</div>`;
}

export function renderList(
  node: AstNode,
  childrenCode: string,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const layoutProps = node.props as any;
  const ordered = layoutProps?.ordered === true;
  const className = "space-y-2";

  if (ordered) {
    return `<ol className="list-decimal list-inside ${className}">
  ${childrenCode}
</ol>`;
  } else {
    return `<ul className="list-disc list-inside ${className}">
  ${childrenCode}
</ul>`;
  }
}

export function renderListItem(
  node: AstNode,
  childrenCode: string,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  return `<li>${childrenCode}</li>`;
}

export function renderNavigator(
  node: AstNode,
  childrenCode: string,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  importManager.addShadcnComponents(["Tabs", "TabsList", "TabsTrigger", "TabsContent"]);
  importManager.addImport('import { useNavigate, useLocation } from "react-router-dom"');

  // Extract navigation items from children
  const items = node.children || [];
  const firstItemProps = items[0]?.props as any;
  const defaultValue = firstItemProps?.destination || firstItemProps?.text || "home";

  const triggers = items
    .map((item) => {
      const itemProps = item.props as any;
      const label = itemProps?.text || itemProps?.label || "Tab";
      const target = itemProps?.destination || label.toLowerCase();
      return `    <TabsTrigger value="${target}" onClick={() => navigate("/${target}")}>${label}</TabsTrigger>`;
    })
    .join("\n");

  return `<Tabs defaultValue="${defaultValue}" className="w-full">
  <TabsList className="grid w-full grid-cols-${items.length}">
${triggers}
  </TabsList>
</Tabs>`;
}

export function renderFab(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  importManager.addShadcnComponent("Button");
  importManager.addImport('import { Plus } from "lucide-react"');

  const mobileProps = node.props as any;
  const icon = mobileProps?.icon || "Plus";
  const action = mobileProps?.action || mobileProps?.destination;

  let onClick = "";
  if (action) {
    if (action === "-1") {
      onClick = `onClick={() => navigate(-1)}`;
    } else if (action.startsWith("http")) {
      onClick = `onClick={() => window.open("${action}", "_blank")}`;
    } else {
      onClick = `onClick={() => navigate("/${action.toLowerCase()}")}`;
    }
  }

  return `<div className="fixed bottom-6 right-6">
  <Button size="lg" className="h-14 w-14 rounded-full shadow-lg" ${onClick}>
    <${icon} className="h-6 w-6" />
  </Button>
</div>`;
}
