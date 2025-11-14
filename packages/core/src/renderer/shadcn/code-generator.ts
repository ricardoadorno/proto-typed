/**
 * CodeGenerator - Generates React/TypeScript code for shadcn components
 */

import {
  ShadcnFile,
  ShadcnExportResult,
  NavigationConfig,
  EXTERNAL_DEPENDENCIES,
  DEV_DEPENDENCIES,
} from "./types";

interface ComponentFile {
  name: string;
  code: string;
  imports: string;
}

export class CodeGenerator {
  /**
   * Generate all project files
   */
  static generate(
    components: ComponentFile[],
    navigation: NavigationConfig,
    themeName: string = "zinc"
  ): ShadcnExportResult {
    const files: ShadcnFile[] = [];

    // Generate component files
    components.forEach((component) => {
      files.push({
        path: `src/components/${component.name}.tsx`,
        content: this.generateComponentFile(component),
      });
    });

    // Generate App.tsx with routing
    files.push({
      path: "src/App.tsx",
      content: this.generateAppFile(navigation),
    });

    // Generate main.tsx
    files.push({
      path: "src/main.tsx",
      content: this.generateMainFile(),
    });

    // Generate globals.css
    files.push({
      path: "src/globals.css",
      content: this.generateGlobalsCss(themeName),
    });

    // Generate utils
    files.push({
      path: "src/lib/utils.ts",
      content: this.generateUtils(),
    });

    // Generate config files
    files.push({
      path: "package.json",
      content: this.generatePackageJson(),
    });

    files.push({
      path: "tsconfig.json",
      content: this.generateTsConfig(),
    });

    files.push({
      path: "tailwind.config.ts",
      content: this.generateTailwindConfig(),
    });

    files.push({
      path: "components.json",
      content: this.generateComponentsJson(),
    });

    files.push({
      path: "vite.config.ts",
      content: this.generateViteConfig(),
    });

    files.push({
      path: "postcss.config.js",
      content: this.generatePostcssConfig(),
    });

    files.push({
      path: "index.html",
      content: this.generateIndexHtml(),
    });

    files.push({
      path: ".gitignore",
      content: this.generateGitignore(),
    });

    files.push({
      path: "README.md",
      content: this.generateReadme(),
    });

    return {
      files,
      dependencies: { ...EXTERNAL_DEPENDENCIES },
      instructions: this.generateInstructions(),
    };
  }

  private static generateComponentFile(component: ComponentFile): string {
    return `${component.imports}

${component.code}
`;
  }

  private static generateAppFile(navigation: NavigationConfig): string {
    const imports = navigation.routes.map((route) =>
      `import { ${route.componentName} } from "./components/${route.componentName}"`
    ).join("\n");

    const defaultRoute = navigation.routes.find(r => r.isDefault)?.path || navigation.routes[0]?.path || "/";

    return `import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
${imports}

function App() {
  return (
    <BrowserRouter>
      <Routes>
${navigation.routes.map(route => `        <Route path="${route.path}" element={<${route.componentName} />} />`).join("\n")}
        <Route path="/" element={<Navigate to="${defaultRoute}" replace />} />
        <Route path="*" element={<Navigate to="${defaultRoute}" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
`;
  }

  private static generateMainFile(): string {
    return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
  }

  private static generateGlobalsCss(themeName: string): string {
    // Using a default dark theme based on shadcn
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;
  }

  private static generateUtils(): string {
    return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;
  }

  private static generatePackageJson(): string {
    return JSON.stringify(
      {
        name: "proto-typed-export",
        private: true,
        version: "0.0.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "tsc && vite build",
          preview: "vite preview",
        },
        dependencies: EXTERNAL_DEPENDENCIES,
        devDependencies: DEV_DEPENDENCIES,
      },
      null,
      2
    );
  }

  private static generateTsConfig(): string {
    return JSON.stringify(
      {
        compilerOptions: {
          target: "ES2020",
          useDefineForClassFields: true,
          lib: ["ES2020", "DOM", "DOM.Iterable"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx",
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true,
          baseUrl: ".",
          paths: {
            "@/*": ["./src/*"],
          },
        },
        include: ["src"],
        references: [{ path: "./tsconfig.node.json" }],
      },
      null,
      2
    );
  }

  private static generateTailwindConfig(): string {
    return `import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
`;
  }

  private static generateComponentsJson(): string {
    return JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema.json",
        style: "default",
        rsc: false,
        tsx: true,
        tailwind: {
          config: "tailwind.config.ts",
          css: "src/globals.css",
          baseColor: "zinc",
          cssVariables: true,
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
      null,
      2
    );
  }

  private static generateViteConfig(): string {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
`;
  }

  private static generatePostcssConfig(): string {
    return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
  }

  private static generateIndexHtml(): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Proto-typed Export</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  }

  private static generateGitignore(): string {
    return `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;
  }

  private static generateReadme(): string {
    return `# Proto-typed Export

This project was generated by [proto-typed](https://github.com/yourusername/proto-typed).

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Install shadcn/ui components:
\`\`\`bash
npx shadcn-ui@latest init
\`\`\`

3. Install required shadcn components (check the console output for the list)

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router

## Project Structure

\`\`\`
src/
├── components/     # Screen components
│   └── ui/        # shadcn/ui components (install separately)
├── lib/           # Utilities
├── App.tsx        # Main app with routing
├── main.tsx       # Entry point
└── globals.css    # Global styles
\`\`\`

## Notes

- This is a starter project. You may need to customize it further.
- Make sure to install all required shadcn/ui components.
- The project uses dark mode by default.
`;
  }

  private static generateInstructions(): string {
    return `
# Installation Instructions

1. Extract the exported files to a directory
2. Run: npm install
3. Initialize shadcn/ui: npx shadcn-ui@latest init
4. Install required components (see list below)
5. Run: npm run dev

The application will be available at http://localhost:5173
`;
  }
}
