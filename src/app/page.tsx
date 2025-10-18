"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DownloadIcon, PlayIcon, RotateCcwIcon } from "lucide-react";

import DocsFooter from "@/components/layouts/components/docs-footer";
import { DocsHeader } from "@/components/layouts/components/docs-header";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EditorPanel,
  ExampleButtons,
  PreviewDevice,
} from "@/components/ui";
import { DSLEditor } from "@/core/editor";
import { useParse } from "@/hooks/use-parse";
import { exampleConfigs } from "@/examples";
import { exportDocument } from "@/utils/export-document";
import { astToHtmlDocument } from "@/core/renderer/ast-to-html-document";
import { withBaseUrl } from "@/utils/with-base-url";
import { cn } from "@/lib/utils";

const DEFAULT_EXAMPLE = exampleConfigs[0]?.code ?? "";

export default function PlaygroundPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [input, setInput] = useState(DEFAULT_EXAMPLE);
  const [activeExample, setActiveExample] = useState(exampleConfigs[0]?.label ?? "");

  const { ast, renderedHtml, metadata, handleParse, navigateToScreen, createClickHandler } = useParse();

  useEffect(() => {
    handleParse(input);
  }, [input, handleParse]);

  const handleRun = () => handleParse(input);
  const handleReset = () => setInput(DEFAULT_EXAMPLE);
  const handleExport = () => {
    if (!ast || (Array.isArray(ast) && ast.length === 0)) {
      return;
    }
    const documentResult = astToHtmlDocument(ast);
    exportDocument(documentResult, "playground-export.html");
  };
  const handleThemeToggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div className={cn("docs-theme", theme === "light" && "docs-theme--light")}> 
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)]">
        <DocsHeader theme={theme} onThemeToggle={handleThemeToggle} onOpenSidebar={() => {}} />
        <main className="mx-auto flex w-full max-w-[1320px] flex-col gap-12 px-4 pb-16 pt-10 sm:px-6 lg:px-10">
          <section className="space-y-5 text-balance">
            <Badge className="w-fit rounded-full border-[color:rgba(139,92,246,0.22)] bg-[color:rgba(139,92,246,0.12)] text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]">
              playground
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight text-[var(--fg-primary)] sm:text-5xl">
              Escreva no editor, valide no preview.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--fg-secondary)]">
              O objetivo aqui é simples: iterar rápido. Use o editor DSL e veja o resultado imediatamente ao lado.
              Quando precisar de mais contexto, a documentação está a um clique de distância.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={withBaseUrl("/docs/getting-started")}>Ver documentação</Link>
              </Button>
              <Button asChild variant="ghost" className="border border-[var(--border-muted)] text-[var(--fg-secondary)] hover:border-[var(--brand-400)] hover:text-[var(--accent)]">
                <Link href={withBaseUrl("/docs/editor-basics")}>Atalhos essenciais</Link>
              </Button>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <Card className="flex h-full flex-col gap-5 border border-[var(--border-muted)] bg-[var(--bg-surface)] p-7 shadow-[0_24px_64px_rgba(14,16,24,0.38)]">
              <CardHeader className="space-y-1 p-0">
                <CardTitle className="text-2xl text-[var(--fg-primary)]">Editor DSL</CardTitle>
                <CardDescription className="text-sm text-[var(--fg-secondary)]">
                  Escreva componentes, telas e fluxos usando a sintaxe declarativa.
                </CardDescription>
              </CardHeader>
              <ExampleButtons
                examples={exampleConfigs.map((example) => ({ label: example.label, code: example.code }))}
                onExampleSelect={(code) => {
                  setInput(code);
                  const current = exampleConfigs.find((example) => example.code === code);
                  setActiveExample(current?.label ?? "");
                }}
              />
              {activeExample ? (
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--fg-secondary)]">
                  Exemplo selecionado: {activeExample}
                </p>
              ) : null}
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={handleRun} className="gap-2">
                  <PlayIcon className="h-4 w-4" /> Executar
                </Button>
                <Button onClick={handleReset} variant="ghost" className="gap-2 border border-[var(--border-muted)] text-[var(--fg-secondary)] hover:border-[var(--brand-400)] hover:text-[var(--accent)]">
                  <RotateCcwIcon className="h-4 w-4" /> Resetar exemplo
                </Button>
                <Button onClick={handleExport} variant="ghost" className="gap-2 border border-[var(--border-muted)] text-[var(--fg-secondary)] hover:border-[var(--brand-400)] hover:text-[var(--accent)]">
                  <DownloadIcon className="h-4 w-4" /> Exportar HTML
                </Button>
              </div>
              <CardContent className="p-0">
                <EditorPanel className="min-h-[640px] border border-[var(--border-muted)] bg-[var(--bg-surface)]">
                  <DSLEditor value={input} onChange={(value) => setInput(value ?? "")} />
                </EditorPanel>
              </CardContent>
            </Card>

            <Card className="flex h-full flex-col gap-5 border border-[var(--border-muted)] bg-[var(--bg-surface)] p-7 shadow-[0_24px_64px_rgba(14,16,24,0.38)]">
              <CardHeader className="space-y-1 p-0">
                <CardTitle className="text-2xl text-[var(--fg-primary)]">Preview ao vivo</CardTitle>
                <CardDescription className="text-sm text-[var(--fg-secondary)]">
                  Interaja com a interface renderizada. Clique em elementos com <code>data-nav</code> para trocar de tela.
                </CardDescription>
              </CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-[var(--fg-secondary)]">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--fg-secondary)]/70">Tela atual</span>
                  <Badge variant="outline" className="rounded-full border-[color:rgba(139,92,246,0.24)] bg-[color:rgba(139,92,246,0.12)] px-3 py-1 text-[10px] text-[var(--accent)]">
                    {metadata?.currentScreen ?? "Sem tela definida"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[var(--fg-secondary)] normal-case">
                  {metadata?.screens.length ? `${metadata.screens.length} telas detectadas` : "Nenhuma tela detectada"}
                </div>
              </div>
              <CardContent className="p-0">
                <PreviewDevice deviceType="iphone-x" zoom={110}>
                  <div
                    className="h-full w-full overflow-auto rounded-[1.5rem] bg-[var(--bg-main)]"
                    style={{ containerType: "inline-size" }}
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                    onClick={createClickHandler()}
                  />
                </PreviewDevice>
              </CardContent>
              {metadata?.screens.length ? (
                <div className="flex flex-wrap gap-2 text-xs text-[var(--fg-secondary)]">
                  {metadata.screens.map((screen) => (
                    <Button
                      key={screen.id}
                      size="sm"
                      variant="ghost"
                      className="rounded-full border border-transparent px-3 py-1 text-xs uppercase tracking-[0.28em] text-[var(--fg-secondary)] hover:border-[var(--brand-400)] hover:text-[var(--accent)]"
                      onClick={() => navigateToScreen(screen.name)}
                    >
                      {screen.name}
                    </Button>
                  ))}
                </div>
              ) : null}
            </Card>
          </section>
        </main>
        <DocsFooter />
      </div>
    </div>
  );
}
