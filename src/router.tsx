import { createBrowserRouter, type RouteObject } from "react-router-dom";
import App from "./app";
import Docs from './pages/docs';
import DocsLayout from './layouts/docs-layout';

const routes: RouteObject[] = [
    { path: "/", Component: App },
    {
        path: "/docs",
        Component: DocsLayout,
        children: [
            {
                index: true,
                element: <Docs />,
            },
            {
                path: "syntax",
                element: <Docs />,
            },
            {
                path: "examples",
                element: <Docs />,
            },
            {
                path: "components",
                element: <Docs />,
            },
            {
                path: "typography",
                element: <Docs />,
            },
            {
                path: "forms",
                element: <Docs />,
            },
            {
                path: "interactive",
                element: <Docs />,
            },
            {
                path: "layout",
                element: <Docs />,
            },
            {
                path: "lists",
                element: <Docs />,
            },
            {
                path: "mobile",
                element: <Docs />,
            },
            {
                path: "modals",
                element: <Docs />,
            },
            {
                path: "navigation",
                element: <Docs />,
            },
            {
                path: "screens",
                element: <Docs />,
            },
            {
                path: "troubleshooting",
                element: <Docs />,
            },
            {
                path: "known-issues",
                element: <Docs />,
            },
            {
                path: ":section",
                element: <Docs />,
            },
        ]
    },
    { path: "*", Component: App },
];

export const router = createBrowserRouter(routes, {
    basename: (import.meta as any).env?.BASE_URL ?? "/",
});

export default router;