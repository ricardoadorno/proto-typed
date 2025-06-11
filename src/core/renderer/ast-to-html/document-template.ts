/**
 * Generate HTML document scripts and CDN links
 */
export function generateDocumentScripts() {
  const tailwindCdn = `<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>`;
  const tailwindConfig = `<script>tailwind.config = { darkMode: 'class', theme: { extend: {} } };</script>`;
  const darkModeScript = `<script>document.documentElement.classList.add('dark');</script>`;
  const lucideScript = `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>`;
  const lucideInitScript = `<script>
    document.addEventListener('DOMContentLoaded', function() {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  </script>`;

  return {
    tailwindCdn,
    tailwindConfig,
    darkModeScript,
    lucideScript,
    lucideInitScript
  };
}

/**
 * Generate HTML document template
 */
export function generateHtmlDocumentTemplate(
  screensHtml: string,
  globalElementsHtml: string,
  navigationScript: string
): string {
  const scripts = generateDocumentScripts();

  return `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${scripts.tailwindCdn}
  ${scripts.tailwindConfig}
  ${scripts.lucideScript}
  <title>Exported Screens</title>
  <style>
    html, body { 
      min-height: 100%; 
      background: linear-gradient(to bottom right, #0f172a, #1e293b);
    }
    .screen { transition: background 0.3s; }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-8">  ${screensHtml}${globalElementsHtml}  ${scripts.darkModeScript}
  ${scripts.lucideInitScript}  <script>
    ${navigationScript}
  </script>
</body>
</html>  `.trim();
}
