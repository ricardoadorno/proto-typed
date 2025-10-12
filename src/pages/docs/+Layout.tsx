import type { ReactNode } from 'react';
import DocsLayout from './layouts/docs-layout';

export default function Layout({ children }: { children: ReactNode }) {
    return <DocsLayout>{children}</DocsLayout>;
}
