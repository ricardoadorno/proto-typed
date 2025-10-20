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
import { availableThemes } from '@/core/themes/theme-definitions';
import { SimpleSelect } from '@/components/ui/select';
import { customPropertiesManager } from '@/core/renderer/core/theme-manager';
import SidebarMobile from "@/components/layouts/components/sidebar-mobile";

const DEFAULT_EXAMPLE = exampleConfigs[0]?.code ?? "";

export default function PlaygroundPage() {
  const [input, setInput] = useState(DEFAULT_EXAMPLE);
  const [activeExample, setActiveExample] = useState(exampleConfigs[0]?.label ?? "");

  const { ast, renderedHtml, metadata, handleParse, navigateToScreen, createClickHandler } = useParse();

  useEffect(() => {
    handleParse(input);
  }, [input, handleParse]);

  const handleReset = () => setInput(DEFAULT_EXAMPLE);
  const handleExport = () => {
    if (!ast || (Array.isArray(ast) && ast.length === 0)) {
      return;
    }
    const documentResult = astToHtmlDocument(ast);
    exportDocument(documentResult, "playground-export.html");
  };


  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)] flex flex-col">
      <DocsHeader />
      <main className="mx-auto flex w-full max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl xl:max-w-[1320px] flex-col gap-6 sm:gap-8 lg:gap-12 px-4 py-8 sm:px-6 md:px-8 lg:px-10 pb-16">
      <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-[var(--fg-primary)]">
        Playground
      </h1>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] max-w-full">
        <Card className="flex h-full flex-col gap-4 border border-[var(--border-muted)] bg-[var(--bg-surface)] p-5 md:p-7 shadow-[0_24px_64px_rgba(14,16,24,0.38)]">
        <CardHeader className="space-y-1 p-0">
          <CardTitle className="text-xl md:text-2xl text-[var(--fg-primary)]">Editor</CardTitle>
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
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild>
          <Link target="_blank" href={("/docs")}>Ver documentação</Link>
          </Button>

          <Button onClick={handleExport} variant="ghost" className="gap-2 border border-[var(--border-muted)] text-[var(--fg-secondary)] hover:border-[var(--brand-400)] hover:text-[var(--accent)]">
          <DownloadIcon className="h-4 w-4" /> Exportar HTML
          </Button>
          <SimpleSelect
          label="Preset de tema"
          options={Object.values(availableThemes).map((theme) => ({
            label: theme.name,
            value: theme.name,
          }))}
          value={customPropertiesManager.getCurrentThemeName()}
          onValueChange={(themeName) => {
            customPropertiesManager.setExternalTheme(themeName);
            handleParse(input);
          }}
          />
        </div>
        <CardContent className="p-0">
          <EditorPanel className="min-h-[360px] md:min-h-[640px] border border-[var(--border-muted)] bg-[var(--bg-surface)] overflow-hidden">
          <div className="h-full w-full">
            <DSLEditor value={input} onChange={(value) => setInput(value ?? "")} />
          </div>
          </EditorPanel>
        </CardContent>
        </Card>

        <Card className="flex h-full flex-col gap-4 border border-[var(--border-muted)] bg-[var(--bg-surface)] p-5 md:p-7 shadow-[0_24px_64px_rgba(14,16,24,0.38)]">
        <CardHeader className="space-y-1 p-0">
          <CardTitle className="text-xl md:text-2xl text-[var(--fg-primary)]">Preview ao vivo</CardTitle>
          <CardDescription className="text-sm text-[var(--fg-secondary)]">
          Interaja com a interface renderizada. Clique nos botões para trocar de tela mais rápido.
          </CardDescription>
        </CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--fg-secondary)] pb-3">
          <div className="flex flex-wrap items-center gap-2 text-[var(--fg-secondary)] text-lg normal-case ml-2">
          {metadata?.screens.length ? `${metadata.screens.length} telas detectadas:` : "Nenhuma tela detectada"}
          </div>
          <div className="flex items-center gap-2">
          {metadata?.screens.length ? (
            <div className="flex flex-wrap gap-2 text-xs text-[var(--fg-secondary)]">
            {metadata.screens.map((screen) => (
              <Button
              key={screen.id}
              size="sm"
              variant="secondary"
              className="rounded-full border border-transparent text-xs text-[var(--fg-secondary)] hover:border-[var(--brand-400)] hover:text-[var(--accent)]"
              onClick={() => navigateToScreen(screen.name)}
              >
              {screen.name}
              </Button>
            )
            )}
            </div>
          ) : null}
          </div>
        </div>
        <CardContent className="p-0">
          <PreviewDevice deviceType="iphone-x" zoom={110} >
          <div
            className="h-full min-h-[320px] md:min-h-[560px] overflow-auto w-full"
            style={{ containerType: 'inline-size' }}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
            onClick={createClickHandler()}
          />
          </PreviewDevice>
        </CardContent>

        </Card>
      </section>
      </main>
      <DocsFooter />
    </div>
  );
}
