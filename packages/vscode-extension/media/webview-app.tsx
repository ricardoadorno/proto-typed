import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

declare const acquireVsCodeApi: undefined | (() => { postMessage(message: unknown): void });

type Diag = {
  message: string;
  stage?: string;
};

type RouteInfo = {
  name: string;
};

type RouteMetadata = {
  screens: RouteInfo[];
  currentScreen?: string;
  defaultScreen?: string;
};

type PreviewMessage = {
  type: "preview:update";
  html: string;
  diagnostics?: Diag[];
  metadata?: RouteMetadata | null;
  currentScreen?: string | null;
};

const DEFAULT_STATUS = "Aguardando…";

const App: React.FC = () => {
  const [status, setStatus] = useState<string>(DEFAULT_STATUS);
  const [statusOk, setStatusOk] = useState<boolean>(true);
  const [screenLabel, setScreenLabel] = useState<string>("—");
  const [html, setHtml] = useState<string>("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = (event: MessageEvent<PreviewMessage>) => {
      const { data } = event;
      if (!data || data.type !== "preview:update") {
        return;
      }

      setHtml(data.html || "");

      const issues = data.diagnostics?.length ?? 0;
      if (issues === 0) {
        setStatus("✓ Sem erros");
        setStatusOk(true);
      } else {
        setStatus(`✗ ${issues} erro(s)`);
        setStatusOk(false);
      }

      const currentScreen = data.currentScreen
        ?? data.metadata?.currentScreen
        ?? data.metadata?.defaultScreen
        ?? data.metadata?.screens?.[0]?.name
        ?? "—";

      setScreenLabel(currentScreen || "—");
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleClick = (event: Event) => {
      const target = event.target instanceof HTMLElement
        ? event.target.closest("[data-nav]")
        : null;

      if (!target) {
        return;
      }

      const navTarget = target.getAttribute("data-nav");
      const navType = target.getAttribute("data-nav-type") || "toggle";
      if (!navTarget) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (navType === "internal") {
        vscodeApi()?.postMessage({ type: "nav:navigate", screen: navTarget });
      } else if (navType === "back") {
        vscodeApi()?.postMessage({ type: "nav:back" });
      } else {
        toggleElement(navTarget, container.ownerDocument);
      }
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [html]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const lucideApi = (window as unknown as { lucide?: { createIcons?: () => void } }).lucide;
    if (lucideApi?.createIcons) {
      try {
        lucideApi.createIcons();
      } catch (error) {
        console.error("Failed to initialize lucide icons", error);
      }
    }
  }, [html]);

  return (
    <div className="app-shell">
      <header className="status-bar">
        <strong>Preview</strong>
        <span className={`status ${statusOk ? "ok" : "err"}`}>{status}</span>
        <span className="screen-label">{screenLabel}</span>
      </header>
      <main className="preview-wrapper">
        <PreviewDevice deviceType="iphone-x" zoom={110}>
          <div
            ref={containerRef}
            className="preview-content"
            style={{ containerType: "inline-size" } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </PreviewDevice>
      </main>
    </div>
  );
};

const PreviewDevice: React.FC<{ deviceType: string; zoom?: number; children: React.ReactNode }> = ({
  children,
  zoom = 100,
}) => {
  const content = useMemo(() => (
    <div className="device-screen">
      <div className="device-screen-glow" />
      <div className="device-content-viewport">
        <div
          className="device-content-inner"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          } as React.CSSProperties}
        >
          {children}
        </div>
      </div>
    </div>
  ), [children, zoom]);

  return (
    <div className="device-frame">
      <div className="device-notch">
        <div className="device-notch-shape" />
      </div>
      <div className="device-speaker" />
      <div className="device-camera" />
      {content}
      <div className="device-home" />
    </div>
  );
};

function toggleElement(name: string, doc: Document) {
  if (toggleModal(name, doc)) return;
  toggleDrawer(name, doc);
}

function toggleModal(name: string, doc: Document) {
  const modal = doc.getElementById(`modal-${name}`);
  if (!modal) return false;

  const hidden = modal.classList.contains("hidden");
  if (hidden) {
    modal.classList.remove("hidden");
    const backdrop = modal.querySelector<HTMLElement>(".modal-backdrop");
    if (backdrop && !backdrop.hasAttribute("data-bound")) {
      backdrop.setAttribute("data-bound", "true");
      backdrop.addEventListener("click", event => {
        if (event.target === backdrop) {
          modal.classList.add("hidden");
        }
      });
    }
  } else {
    modal.classList.add("hidden");
  }

  return true;
}

function toggleDrawer(name: string, doc: Document) {
  const drawer = doc.getElementById(`drawer-${name}`);
  if (!drawer) return false;

  const hidden = drawer.classList.contains("hidden");
  const content = drawer.querySelector<HTMLElement>(".drawer");

  if (hidden) {
    drawer.classList.remove("hidden");
    if (content) {
      content.classList.add("translate-x-0");
      content.classList.remove("-translate-x-full");
    }
    const overlay = drawer.querySelector<HTMLElement>(".drawer-overlay");
    if (overlay && !overlay.hasAttribute("data-bound")) {
      overlay.setAttribute("data-bound", "true");
      overlay.addEventListener("click", event => {
        if (event.target === overlay) {
          if (content) {
            content.classList.remove("translate-x-0");
            content.classList.add("-translate-x-full");
          }
          setTimeout(() => drawer.classList.add("hidden"), 300);
        }
      });
    }
  } else {
    if (content) {
      content.classList.remove("translate-x-0");
      content.classList.add("-translate-x-full");
    }
    setTimeout(() => drawer.classList.add("hidden"), 300);
  }

  return true;
}

function vscodeApi() {
  return typeof acquireVsCodeApi === "function" ? acquireVsCodeApi() : undefined;
}

const container = document.getElementById("proto-typed-root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
