export function getDeviceMockupStyles(): string {
  return `
        /* VSCode Webview Base Styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: #0b0d14; color: rgba(255, 255, 255, 0.95); overflow: hidden; min-height: 100vh; }

        .preview-header { padding: 12px 20px; background: #11121a; border-bottom: 1px solid rgba(169, 175, 191, 0.15); display: flex; align-items: center; gap: 12px; height: 48px; }
        .preview-logo { width: 24px; height: 24px; }
        .preview-title { font-size: 14px; font-weight: 600; color: rgba(255, 255, 255, 0.95); flex: 1; }

        .preview-container { height: calc(100vh - 48px - 40px); display: flex; align-items: center; justify-content: center; padding: 24px; overflow: hidden; background: #0b0d14; }
        .device-frame { transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; }

        /* iPhone Mockup */
        .iphone-mockup { position: relative; margin: 0 auto; height: 780px; width: 360px; overflow: hidden; border-radius: 2rem; border: 1px solid rgba(139, 92, 246, 0.25); background: var(--bg-main); box-shadow: 0 0 0 6px rgba(17, 18, 26, 0.8), 0 32px 64px rgba(12, 14, 24, 0.45); }
        .home-indicator { position: absolute; bottom: 6px; left: 50%; height: 3px; width: 130px; transform: translateX(-50%); border-radius: 2px; background: rgba(169, 175, 191, 0.4); z-index: 10; }
        .notch { position: absolute; left: 50%; top: 0; z-index: 10; height: 24px; width: 56%; transform: translateX(-50%); border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; background: var(--bg-main); }
        .speaker { position: absolute; left: 50%; top: 0; height: 6px; width: 15%; transform: translateX(-50%) translateY(5px); border-radius: 3px; background: var(--bg-surface); box-shadow: inset 0 -1px 2px rgba(255, 255, 255, 0.08); z-index: 11; }
        .camera { position: absolute; left: calc(50% + 70px); top: 3px; height: 10px; width: 10px; border-radius: 50%; background: var(--bg-surface); box-shadow: inset 0 -1px 3px rgba(255, 255, 255, 0.08); z-index: 11; }
        .camera-inner { position: absolute; left: 2.5px; top: 2.5px; height: 5px; width: 5px; border-radius: 50%; background: rgba(139, 92, 246, 0.8); box-shadow: inset 0 -1px 2px rgba(0, 0, 0, 0.25); }

        .device-content { height: 100%; width: 100%; display: flex; flex-direction: column; overflow: hidden; }
        .device-content::-webkit-scrollbar { width: 6px; }
        .device-content::-webkit-scrollbar-track { background: transparent; }
        .device-content::-webkit-scrollbar-thumb { background: rgba(169, 175, 191, 0.3); border-radius: 3px; }
        .device-content::-webkit-scrollbar-thumb:hover { background: rgba(169, 175, 191, 0.5); }
        .preview-scroll { flex: 1 1 auto; height: 100%; overflow: hidden; display: flex; flex-direction: column; }

        /* Screen Navigation */
        .screen-navigation { padding: 8px 20px; background: #16171f; border-bottom: 1px solid rgba(169, 175, 191, 0.15); display: flex; gap: 8px; flex-wrap: wrap; max-height: 120px; overflow-y: auto; position: relative; z-index: 100; }
        .screen-btn { padding: 6px 12px; background: #1e293b; border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 8px; color: rgba(255, 255, 255, 0.7); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .screen-btn:hover { background: #2d3748; border-color: rgba(139, 92, 246, 0.6); color: rgba(255, 255, 255, 0.95); }
        .screen-btn.active { background: rgba(139, 92, 246, 0.2); border-color: #8b5cf6; color: #a78bfa; }
        .current-screen { margin-left: auto; font-size: 12px; color: rgba(255, 255, 255, 0.5); font-weight: 400; }

        /* Browser Mockup (kept for parity) */
        .browser-mockup { position: relative; margin: 0 auto; height: 600px; width: 100%; max-width: 920px; overflow: hidden; border-radius: 24px; border: 1px solid rgba(139, 92, 246, 0.25); background: var(--bg-main); box-shadow: 0 32px 64px rgba(12, 14, 24, 0.45); }
        .browser-header { position: relative; height: 48px; background: var(--bg-surface); border-bottom: 1px solid var(--border-main); }
        .traffic-lights { position: absolute; left: 24px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 8px; }
        .traffic-lights .light { height: 12px; width: 12px; border-radius: 50%; }
        .traffic-lights .light.red { background: var(--danger); }
        .traffic-lights .light.yellow { background: var(--warning); }
        .traffic-lights .light.green { background: var(--brand-400); }
        .url-bar { position: absolute; left: 88px; top: 50%; transform: translateY(-50%); height: 28px; width: calc(100% - 112px); border-radius: 12px; border: 1px solid var(--border-muted); background: var(--bg-raised); }
  `
}

export function renderIphoneMockup(innerHtml: string): string {
  return `
    <div class="device-frame">
      <div class="iphone-mockup">
        <div class="home-indicator"></div>
        <div class="notch"></div>
        <div class="speaker"></div>
        <div class="camera"><div class="camera-inner"></div></div>
        <div class="device-content">${innerHtml}</div>
      </div>
    </div>
  `
}
