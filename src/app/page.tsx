"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { withBaseUrl } from "@/utils/with-base-url";

import DocsFooter from "@/components/layouts/components/docs-footer";
import { DocsHeader } from "@/components/layouts/components/docs-header";
import { type ConsoleLogEntry, type ConsoleLogLevel, PlaygroundConsoleDock } from "@/components/playground/console-dock";
import PlaygroundInspector from "@/components/playground/inspector";
import PlaygroundNavigator from "@/components/playground/navigator";
import { PlaygroundToolbar } from "@/components/playground/toolbar";
import {
  ActionButtons,
  ExampleButtons,
  DeviceSelector,
  ThemeSelector,
  EditorPanel,
  PreviewDevice,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  ScrollArea,
  Separator,
  Button,
  Badge,
} from "@/components/ui";
import AstModal from "../components/ui/ast-modal";
import { DSLEditor } from "../core/editor";
import { customPropertiesManager } from "../core/renderer/core/theme-manager";
import { astToHtmlDocument } from "../core/renderer/ast-to-html-document";
import { errorBus } from "../core/error-bus";
import { useParse } from "../hooks/use-parse";
import { exampleConfigs } from "../examples";
import { exportDocument } from "../utils";
import type { ProtoError } from "../types/errors";

const THEME_STORAGE_KEY = "proto.theme.preference";
const PANEL_STORAGE_KEY = "proto.playground.panels";
const CONSOLE_STORAGE_KEY = "proto.playground.console";

const MIN_NAVIGATOR = 240;
const MIN_PREVIEW = 320;
const MIN_EDITOR = 520;
const PANEL_GAP = 32;

const MIN_CONSOLE_HEIGHT = 180;
const MAX_CONSOLE_HEIGHT = 460;

export default function App() {
  const [input, setInput] = useState(exampleConfigs[0]?.code ?? "");
  const [uiStyle, setUiStyle] = useState("iphone-x");
  const [selectedTheme, setSelectedTheme] = useState("neutral");
  const [autoRun, setAutoRun] = useState(true);
  const [pickMode, setPickMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isNavigatorSheetOpen, setNavigatorSheetOpen] = useState(false);
  const [logs, setLogs] = useState<ConsoleLogEntry[]>([]);
  const [errors, setErrors] = useState<ProtoError[]>([]);

  const [panelState, setPanelState] = useState(() => ({ navigator: 280, preview: 420 }));
  const [consoleState, setConsoleState] = useState(() => ({ open: true, height: 240 }));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<any>(null);

  const {
    ast,
    astResultJson,
    renderedHtml,
    metadata,
    handleParse,
    navigateToScreen,
    createClickHandler,
  } = useParse();

  // Hydrate persisted theme
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Hydrate panel layout
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const stored = localStorage.getItem(PANEL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { navigator: number; preview: number };
        if (
          typeof parsed?.navigator === "number" &&
          typeof parsed?.preview === "number"
        ) {
          setPanelState(parsed);
        }
      }
    } catch {
      // ignore corrupted layout state
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(PANEL_STORAGE_KEY, JSON.stringify(panelState));
  }, [panelState]);

  // Hydrate console height
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const stored = localStorage.getItem(CONSOLE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { open: boolean; height: number };
        if (typeof parsed?.height === "number") {
          setConsoleState({
            open: parsed.open ?? true,
            height: Math.min(Math.max(parsed.height, MIN_CONSOLE_HEIGHT), MAX_CONSOLE_HEIGHT),
          });
        }
      }
    } catch {
      // ignore corrupted layout state
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(CONSOLE_STORAGE_KEY, JSON.stringify(consoleState));
  }, [consoleState]);

  // Subscribe to ErrorBus for console feedback
  useEffect(() => {
    const unsubscribe = errorBus.subscribe((nextErrors) => {
      setErrors(nextErrors);
    });
    return () => unsubscribe();
  }, []);

  const pushLog = useCallback(
    (message: string, level: ConsoleLogLevel = "info") => {
      const entry: ConsoleLogEntry = {
        id:
          typeof window !== "undefined" && "crypto" in window && typeof window.crypto.randomUUID === "function"
            ? window.crypto.randomUUID()
            : Math.random().toString(36).slice(2),
        message,
        level,
        timestamp: Date.now(),
      };
      setLogs((prev) => [...prev.slice(-49), entry]);
    },
    []
  );

  // Initial parse once
  useEffect(() => {
    handleParse(input);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-run on input change
  useEffect(() => {
    if (autoRun) {
      handleParse(input);
    }
  }, [autoRun, input, handleParse]);

  // Sync theme tokens for renderer
  useEffect(() => {
    customPropertiesManager.setExternalTheme(selectedTheme);
    handleParse(input);
  }, [selectedTheme, input, handleParse]);

  const handleExportHtml = useCallback(() => {
    if (Object.keys(ast ?? {}).length === 0) {
      pushLog("Nothing to export yet", "warning");
      return;
    }
    const documentResult = astToHtmlDocument(ast);
    exportDocument(documentResult, "exported-ast.html");
    pushLog("HTML export generated", "success");
  }, [ast, pushLog]);

  const handleManualRun = useCallback(() => {
    handleParse(input);
    pushLog("Run executed manually", "success");
  }, [handleParse, input, pushLog]);

  const handleReset = useCallback(() => {
    const defaultExample = exampleConfigs[0]?.code ?? "";
    setInput(defaultExample);
    if (!autoRun) {
      handleParse(defaultExample);
    }
    pushLog("Playground reset to base example", "warning");
  }, [autoRun, handleParse, pushLog]);

  const handleFormat = useCallback(() => {
    const action = editorRef.current?.getAction?.("editor.action.formatDocument");
    if (action?.run) {
      action.run();
      pushLog("Document formatted", "success");
    } else {
      pushLog("Formatter not available yet", "warning");
    }
  }, [pushLog]);

  const handleUndo = useCallback(() => {
    editorRef.current?.trigger?.("keyboard", "undo", null);
  }, []);

  const handleRedo = useCallback(() => {
    editorRef.current?.trigger?.("keyboard", "redo", null);
  }, []);

  const handleFind = useCallback(() => {
    const action = editorRef.current?.getAction?.("actions.find");
    action?.run?.();
  }, []);

  const handleShare = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set("dsl", encodeURIComponent(input));
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(shareUrl.toString())
        .then(() => pushLog("Share link copied to clipboard", "success"))
        .catch(() => pushLog("Não foi possível copiar o link", "warning"));
    } else {
      pushLog("Clipboard API indisponível", "warning");
    }
  }, [input, pushLog]);

  const commandGroups = useMemo(
    () => [
      {
        heading: "Playground",
        items: [
          { label: "Run", shortcut: "⌘↵", onSelect: handleManualRun },
          { label: "Reset", shortcut: "⌘⌫", onSelect: handleReset },
          { label: "Format", shortcut: "⌘⇧F", onSelect: handleFormat },
          {
            label: autoRun ? "Disable Auto-Run" : "Enable Auto-Run",
            shortcut: "⌘⇧A",
            onSelect: () => setAutoRun((prev) => !prev),
          },
        ],
      },
      {
        heading: "Editor",
        items: [
          { label: "Undo", shortcut: "⌘Z", onSelect: handleUndo },
          { label: "Redo", shortcut: "⌘⇧Z", onSelect: handleRedo },
          { label: "Find", shortcut: "⌘F", onSelect: handleFind },
        ],
      },
      {
        heading: "Share",
        items: [
          { label: "Share Link", shortcut: "⌘⇧S", onSelect: handleShare },
          { label: "Export HTML", shortcut: "⌘⇧E", onSelect: handleExportHtml },
        ],
      },
    ],
    [autoRun, handleExportHtml, handleFind, handleFormat, handleManualRun, handleRedo, handleReset, handleShare, handleUndo]
  );

  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const handleOpenCommandPalette = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
        })
      );
    }
  }, []);

  const handleNavigatorResizeStart = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      const startX = event.clientX;
      const { navigator, preview } = panelState;
      const containerWidth = containerRef.current?.offsetWidth ?? 0;
      const available = containerWidth - PANEL_GAP * 2;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        let nextNavigator = Math.min(
          Math.max(navigator + delta, MIN_NAVIGATOR),
          available - MIN_EDITOR - MIN_PREVIEW
        );
        const nextPreview = preview;
        const editorWidth = available - nextNavigator - nextPreview;
        if (editorWidth < MIN_EDITOR) {
          nextNavigator = available - MIN_EDITOR - nextPreview;
        }
        setPanelState({ navigator: nextNavigator, preview: nextPreview });
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [panelState]
  );

  const handlePreviewResizeStart = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      const startX = event.clientX;
      const { navigator, preview } = panelState;
      const containerWidth = containerRef.current?.offsetWidth ?? 0;
      const available = containerWidth - PANEL_GAP * 2;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        let nextPreview = Math.min(
          Math.max(preview - delta, MIN_PREVIEW),
          available - MIN_NAVIGATOR - MIN_EDITOR
        );
        const editorWidth = available - navigator - nextPreview;
        if (editorWidth < MIN_EDITOR) {
          nextPreview = available - navigator - MIN_EDITOR;
        }
        setPanelState({ navigator, preview: nextPreview });
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [panelState]
  );

  const handleConsoleResizeStart = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();
      const startY = event.clientY;
      const { height } = consoleState;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = startY - moveEvent.clientY;
        const nextHeight = Math.min(
          Math.max(height + delta, MIN_CONSOLE_HEIGHT),
          MAX_CONSOLE_HEIGHT
        );
        setConsoleState((prev) => ({ ...prev, height: nextHeight }));
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [consoleState]
  );

  const toggleConsole = useCallback(() => {
    setConsoleState((prev) => ({ ...prev, open: !prev.open }));
  }, []);

  const handleToggleAutoRun = useCallback(() => {
    setAutoRun((prev) => {
      const next = !prev;
      pushLog(next ? "Auto-run ativado" : "Auto-run desativado", "info");
      return next;
    });
  }, [pushLog]);

  const handleTogglePickMode = useCallback(() => {
    setPickMode((prev) => {
      const next = !prev;
      pushLog(next ? "Pick mode habilitado" : "Pick mode desabilitado", "info");
      return next;
    });
  }, [pushLog]);

  const handleZoomChange = useCallback((nextZoom: number) => {
    setZoom(nextZoom);
  }, []);

  const zoomLevels = useMemo(() => [80, 100, 120, 140], []);

  return (
    <div className={cn("docs-theme", theme === "light" && "docs-theme--light")}>
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--fg-primary)]">
        <DocsHeader
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onOpenSidebar={() => setNavigatorSheetOpen(true)}
          commandGroups={commandGroups}
        />
        <main className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <SectionHeader onOpenDocs={() => window.location.assign(withBaseUrl("/docs"))} />

          <PlaygroundToolbar
            autoRun={autoRun}
            pickMode={pickMode}
            onRun={handleManualRun}
            onReset={handleReset}
            onFormat={handleFormat}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onFind={handleFind}
            onShare={handleShare}
            onExport={handleExportHtml}
            onToggleAutoRun={handleToggleAutoRun}
            onTogglePickMode={handleTogglePickMode}
            onOpenCommandPalette={handleOpenCommandPalette}
          />

          <div ref={containerRef} className="flex flex-1 flex-col gap-4 xl:flex-row xl:gap-8">
            <div className="hidden xl:block" style={{ width: panelState.navigator }}>
              <PlaygroundNavigator
                metadata={metadata}
                currentScreen={metadata?.currentScreen ?? null}
                onSelectScreen={navigateToScreen}
              />
            </div>
            <div
              className="hidden h-auto w-1 cursor-col-resize rounded-full bg-[color:rgba(139,92,246,0.24)] xl:block"
              onMouseDown={handleNavigatorResizeStart}
            />

            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-surface)]/90 p-4 shadow-[0_24px_72px_rgba(14,16,24,0.4)] sm:p-6">
                <ActionButtons onExportHtml={handleExportHtml}>
                  <AstModal ast={astResultJson} html={renderedHtml} />
                </ActionButtons>
                <ExampleButtons
                  examples={exampleConfigs.map((example) => ({ label: example.label, code: example.code }))}
                  onExampleSelect={(code) => setInput(code)}
                />
                <EditorPanel className="mt-4 min-h-[520px] border border-[var(--border-muted)] bg-[var(--bg-surface)]">
                  <div className="flex-1 min-h-0">
                    <DSLEditor
                      value={input}
                      onChange={(value) => setInput(value ?? "")}
                      onEditorReady={(editor) => {
                        editorRef.current = editor;
                      }}
                    />
                  </div>
                </EditorPanel>
              </div>
            </div>

            <div
              className="hidden h-auto w-1 cursor-col-resize rounded-full bg-[color:rgba(139,92,246,0.24)] xl:block"
              onMouseDown={handlePreviewResizeStart}
            />

            <div className="hidden flex-col gap-4 xl:flex" style={{ width: panelState.preview }}>
              <div className="rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-surface)] p-4 shadow-[0_18px_48px_rgba(14,16,24,0.32)]">
                <div className="grid gap-4">
                  <DeviceSelector value={uiStyle} onChange={setUiStyle} />
                  <ThemeSelector value={selectedTheme} onChange={setSelectedTheme} />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--fg-secondary)]">
                      Zoom
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {zoomLevels.map((level) => (
                        <Button
                          key={level}
                          type="button"
                          variant="ghost"
                          onClick={() => handleZoomChange(level)}
                          className={cn(
                            "h-8 rounded-xl border px-3 text-xs uppercase tracking-[0.28em]",
                            zoom === level
                              ? "border-[var(--brand-400)] bg-[color:rgba(139,92,246,0.18)] text-[var(--accent)]"
                              : "border-[var(--border-muted)] bg-[var(--bg-raised)] text-[var(--fg-secondary)] hover:border-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.12)] hover:text-[var(--accent)]"
                          )}
                        >
                          {level}%
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Separator className="border-[var(--border-muted)]" />
                  <Badge className="w-fit rounded-full border-[color:rgba(139,92,246,0.2)] bg-[color:rgba(139,92,246,0.12)] text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]">
                    Preview
                  </Badge>
                </div>
              </div>
              <PreviewDevice deviceType={uiStyle} zoom={zoom}>
                <div
                  className="overflow-auto"
                  style={{ containerType: "inline-size" }}
                  dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  onClick={createClickHandler()}
                />
              </PreviewDevice>
              <PlaygroundInspector metadata={metadata} currentScreen={metadata?.currentScreen ?? null} pickMode={pickMode} />
            </div>
          </div>

          <div
            className="rounded-3xl border border-[var(--border-muted)] bg-[var(--bg-surface)] shadow-[0_18px_48px_rgba(14,16,24,0.28)] transition-[height]"
            style={{ height: consoleState.open ? consoleState.height : 56 }}
          >
            <PlaygroundConsoleDock
              open={consoleState.open}
              onToggle={toggleConsole}
              onResizeStart={handleConsoleResizeStart}
              logs={logs}
              errors={errors}
              metadata={metadata}
            />
          </div>
        </main>
        <DocsFooter />
      </div>

      <Sheet open={isNavigatorSheetOpen} onOpenChange={setNavigatorSheetOpen}>
        <SheetContent side="left" className="w-[85%] max-w-[360px] border-r border-[var(--border-muted)] bg-[var(--bg-surface)]">
          <SheetHeader className="text-left">
            <SheetTitle className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--fg-secondary)]">
              Navigator
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 h-[calc(100%-48px)]">
            <ScrollArea className="h-full pr-3">
              <PlaygroundNavigator
                metadata={metadata}
                currentScreen={metadata?.currentScreen ?? null}
                onSelectScreen={(screen) => {
                  navigateToScreen(screen);
                  setNavigatorSheetOpen(false);
                }}
                onClose={() => setNavigatorSheetOpen(false)}
              />
            </ScrollArea>
          </div>
          <div className="mt-4 flex justify-end">
            <SheetClose asChild>
              <Button variant="ghost" size="sm" className="text-[var(--fg-secondary)] hover:text-[var(--accent)]">
                Fechar
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SectionHeader({ onOpenDocs }: { onOpenDocs: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--fg-primary)]">proto-typed Playground</h1>
        <p className="text-sm text-[var(--fg-secondary)]">
          Prototype, debug and export interfaces powered by the proto-typed DSL.
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        onClick={onOpenDocs}
        className="gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--fg-secondary)] transition-colors hover:border-[var(--brand-400)] hover:bg-[color:rgba(139,92,246,0.12)] hover:text-[var(--accent)]"
      >
        Abrir documentação
      </Button>
    </div>
  );
}
