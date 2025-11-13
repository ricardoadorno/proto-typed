/**
 * Shadcn renderers for primitive nodes
 */

import { AstNode } from "../../../types/ast-node.js";
import { ImportManager } from "../import-manager.js";
import { ShadcnRenderContext } from "../types.js";

export function renderButton(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  importManager.addShadcnComponent("Button");

  const buttonProps = node.props as any;
  const text = buttonProps?.text || node.value || "Button";
  const variant = buttonProps?.variant || "default";
  const size = buttonProps?.size || "default";

  // Handle navigation
  const navTarget = buttonProps?.action;
  let onClick = "";

  if (navTarget) {
    importManager.addImport('import { useNavigate } from "react-router-dom"');
    if (navTarget === "-1") {
      onClick = `onClick={() => navigate(-1)}`;
    } else if (navTarget.startsWith("http")) {
      onClick = `onClick={() => window.open("${navTarget}", "_blank")}`;
    } else {
      onClick = `onClick={() => navigate("/${navTarget.toLowerCase()}")}`;
    }
  }

  const props = [
    variant !== "default" ? `variant="${variant}"` : "",
    size !== "default" ? `size="${size}"` : "",
    onClick,
  ]
    .filter(Boolean)
    .join(" ");

  return `<Button ${props}>${text}</Button>`;
}

export function renderLink(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const linkProps = node.props as any;
  const text = linkProps?.text || node.value || "Link";
  const destination = linkProps?.destination || "#";
  const external = linkProps?.external || destination.startsWith("http") || destination.startsWith("mailto:");

  if (external) {
    return `<a href="${destination}" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">${text}</a>`;
  } else {
    importManager.addImport('import { Link } from "react-router-dom"');
    return `<Link to="/${destination.toLowerCase()}" className="text-primary underline-offset-4 hover:underline">${text}</Link>`;
  }
}

export function renderImage(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const imageProps = node.props as any;
  const src = imageProps?.src || "";
  const alt = imageProps?.alt || "";
  const widthPx = imageProps?.widthPx;
  const heightPx = imageProps?.heightPx;
  const shape = imageProps?.shape || "rounded";

  const className = shape === "circle" ? "rounded-full" : "rounded-md";

  const styleProps = [];
  if (widthPx) styleProps.push(`width: "${widthPx}px"`);
  if (heightPx) styleProps.push(`height: "${heightPx}px"`);

  const style = styleProps.length > 0 ? ` style={{${styleProps.join(", ")}}}` : "";

  return `<img src="${src}" alt="${alt}" className="${className}"${style} />`;
}

export function renderHeading(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const textProps = node.props as any;
  const text = textProps?.value || node.value || "";
  const kind = node.kind || textProps?.kind || "h2";

  const headingMap: Record<string, { level: number; className: string }> = {
    h1: {
      level: 1,
      className: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    },
    h2: {
      level: 2,
      className: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    },
    h3: {
      level: 3,
      className: "scroll-m-20 text-2xl font-semibold tracking-tight",
    },
    h4: {
      level: 4,
      className: "scroll-m-20 text-xl font-semibold tracking-tight",
    },
  };

  const heading = headingMap[kind] || headingMap["h2"];
  return `<h${heading.level} className="${heading.className}">${text}</h${heading.level}>`;
}

export function renderText(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const textProps = node.props as any;
  const text = textProps?.value || node.value || "";
  const kind = node.kind || textProps?.kind || "p";

  // Map text kinds to shadcn/Tailwind classes
  const textKindMap: Record<string, string> = {
    p: "leading-7 [&:not(:first-child)]:mt-6",
    small: "text-sm font-medium leading-none",
    muted: "text-sm text-muted-foreground",
  };

  const className = textKindMap[kind] || textKindMap["p"];
  return `<p className="${className}">${text}</p>`;
}

export function renderParagraph(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const textProps = node.props as any;
  const text = textProps?.value || node.value || "";
  return `<p className="leading-7 [&:not(:first-child)]:mt-6">${text}</p>`;
}

export function renderMutedText(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const textProps = node.props as any;
  const text = textProps?.value || node.value || "";
  return `<p className="text-sm text-muted-foreground">${text}</p>`;
}

export function renderNote(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const textProps = node.props as any;
  const text = textProps?.value || node.value || "";
  return `<div className="rounded-lg border bg-card text-card-foreground p-4">
  <p className="text-sm">${text}</p>
</div>`;
}

export function renderQuote(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const textProps = node.props as any;
  const text = textProps?.value || node.value || "";
  return `<blockquote className="mt-6 border-l-2 pl-6 italic">${text}</blockquote>`;
}

export function renderSeparator(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  importManager.addShadcnComponent("Separator");
  return `<Separator />`;
}
