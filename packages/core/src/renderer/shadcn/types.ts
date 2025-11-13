/**
 * Types for Shadcn Renderer
 */

export interface ShadcnImport {
  componentName: string;
  importPath: string;
}

export interface ShadcnComponent {
  name: string;
  code: string;
  imports: Set<ShadcnImport>;
  dependencies: Set<string>;
}

export interface ShadcnRenderContext {
  componentName?: string;
  isRootComponent?: boolean;
  parentType?: string;
  depth?: number;
}

export interface ShadcnExportResult {
  files: ShadcnFile[];
  dependencies: Record<string, string>;
  instructions: string;
}

export interface ShadcnFile {
  path: string;
  content: string;
}

export interface RouteConfig {
  path: string;
  componentName: string;
  isDefault?: boolean;
}

export interface NavigationConfig {
  routes: RouteConfig[];
  modals: string[];
  drawers: string[];
}

/**
 * Mapping of shadcn components to their import paths
 */
export const SHADCN_COMPONENTS: Record<string, string> = {
  Button: "@/components/ui/button",
  Dialog: "@/components/ui/dialog",
  DialogContent: "@/components/ui/dialog",
  DialogDescription: "@/components/ui/dialog",
  DialogHeader: "@/components/ui/dialog",
  DialogTitle: "@/components/ui/dialog",
  DialogTrigger: "@/components/ui/dialog",
  Sheet: "@/components/ui/sheet",
  SheetContent: "@/components/ui/sheet",
  SheetDescription: "@/components/ui/sheet",
  SheetHeader: "@/components/ui/sheet",
  SheetTitle: "@/components/ui/sheet",
  SheetTrigger: "@/components/ui/sheet",
  Input: "@/components/ui/input",
  Select: "@/components/ui/select",
  SelectContent: "@/components/ui/select",
  SelectItem: "@/components/ui/select",
  SelectTrigger: "@/components/ui/select",
  SelectValue: "@/components/ui/select",
  Checkbox: "@/components/ui/checkbox",
  RadioGroup: "@/components/ui/radio-group",
  RadioGroupItem: "@/components/ui/radio-group",
  Label: "@/components/ui/label",
  Card: "@/components/ui/card",
  CardContent: "@/components/ui/card",
  CardDescription: "@/components/ui/card",
  CardFooter: "@/components/ui/card",
  CardHeader: "@/components/ui/card",
  CardTitle: "@/components/ui/card",
  Tabs: "@/components/ui/tabs",
  TabsContent: "@/components/ui/tabs",
  TabsList: "@/components/ui/tabs",
  TabsTrigger: "@/components/ui/tabs",
  Separator: "@/components/ui/separator",
  Avatar: "@/components/ui/avatar",
  AvatarFallback: "@/components/ui/avatar",
  AvatarImage: "@/components/ui/avatar",
  Badge: "@/components/ui/badge",
};

export const EXTERNAL_DEPENDENCIES: Record<string, string> = {
  react: "^18.3.0",
  "react-dom": "^18.3.0",
  "react-router-dom": "^6.22.0",
  "class-variance-authority": "^0.7.0",
  clsx: "^2.1.0",
  "tailwind-merge": "^2.2.0",
  "lucide-react": "^0.344.0",
};

export const DEV_DEPENDENCIES: Record<string, string> = {
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.2.1",
  typescript: "^5.2.2",
  vite: "^5.1.0",
  tailwindcss: "^3.4.1",
  postcss: "^8.4.35",
  autoprefixer: "^10.4.17",
};
