import DocsLayoutWrapper from '@/components/layouts/docs-layout-wrapper'

export default function LayoutDoc({ children }: { children: React.ReactNode }) {
  return <DocsLayoutWrapper>{children}</DocsLayoutWrapper>
}
