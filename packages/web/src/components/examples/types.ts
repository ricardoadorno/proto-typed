/**
 * Type definitions for the examples system
 */

export interface Example {
  name: string
  code: string
  description: string
}

export interface ExampleCategory {
  title: string
  examples: Example[]
}

export interface ExampleData {
  layout: ExampleCategory
  forms: ExampleCategory
  interactive: ExampleCategory
  display: ExampleCategory
  mobile: ExampleCategory
}

export interface ExampleTabProps {
  activeTab: string
  selectedExample: number
  onTabChange: (tab: string) => void
  onExampleChange: (index: number) => void
}

export interface ExamplePreviewProps {
  code: string
  currentScreen?: string
  onScreenChange: (screen: string) => void
}
