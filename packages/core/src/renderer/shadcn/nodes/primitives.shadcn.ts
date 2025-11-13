/**
 * Shadcn renderers for primitive nodes
 */

import { AstNode } from "../../types/ast-node";
import { ImportManager } from "../import-manager";
import { ShadcnRenderContext } from "../types";

export function renderButton(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  importManager.addShadcnComponent("Button");

  const interactiveProps = node.props as any;
  const text = interactiveProps?.text || "Button";
  const variant = interactiveProps?.variant || "default";
  const size = interactiveProps?.size || "default";

  // Handle navigation
  const navTarget = interactiveProps?.destination || interactiveProps?.action;
  let onClick = "";

  if (navTarget) {
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
  const interactiveProps = node.props as any;
  const text = interactiveProps?.text || "Link";
  const href = interactiveProps?.destination || interactiveProps?.action || "#";

  // Check if it's internal or external
  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">${text}</a>`;
  } else {
    importManager.addImport('import { Link } from "react-router-dom"');
    return `<Link to="/${href.toLowerCase()}" className="text-primary underline-offset-4 hover:underline">${text}</Link>`;
  }
}

export function renderImage(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const interactiveProps = node.props as any;
  const src = interactiveProps?.src || "";
  const alt = interactiveProps?.alt || "";
  const width = interactiveProps?.width;
  const height = interactiveProps?.height;

  const className = ["rounded-md"];

  if (interactiveProps?.className) {
    className.push(interactiveProps.className);
  }

  const styleProps = [];
  if (width) styleProps.push(`width: "${width}"`);
  if (height) styleProps.push(`height: "${height}"`);

  const style = styleProps.length > 0 ? ` style={{${styleProps.join(", ")}}}` : "";

  return `<img src="${src}" alt="${alt}" className="${className.join(" ")}"${style} />`;
}

export function renderHeading(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const textProps = node.props as any;
  const level = textProps?.level || 2;
  const text = textProps?.content || textProps?.text || "";

  const classMap: Record<number, string> = {
    1: "text-4xl font-extrabold tracking-tight lg:text-5xl",
    2: "text-3xl font-semibold tracking-tight",
    3: "text-2xl font-semibold tracking-tight",
    4: "text-xl font-semibold tracking-tight",
    5: "text-lg font-semibold tracking-tight",
    6: "text-base font-semibold tracking-tight",
  };

  const className = classMap[level] || classMap[2];

  return `<h${level} className="${className}">${text}</h${level}>`;
}

export function renderText(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const textProps = node.props as any;
  const text = textProps?.content || textProps?.text || "";
  return `<p className="text-foreground">${text}</p>`;
}

export function renderParagraph(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const textProps = node.props as any;
  const text = textProps?.content || textProps?.text || "";
  return `<p className="leading-7">${text}</p>`;
}

export function renderMutedText(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const textProps = node.props as any;
  const text = textProps?.content || textProps?.text || "";
  return `<p className="text-sm text-muted-foreground">${text}</p>`;
}

export function renderNote(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const textProps = node.props as any;
  const text = textProps?.content || textProps?.text || "";
  return `<div className="rounded-lg border bg-card p-4">
  <p className="text-sm">${text}</p>
</div>`;
}

export function renderQuote(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  const textProps = node.props as any;
  const text = textProps?.content || textProps?.text || "";
  return `<blockquote className="border-l-2 pl-6 italic">${text}</blockquote>`;
}

export function renderSeparator(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  importManager.addShadcnComponent("Separator");
  return `<Separator />`;
}
