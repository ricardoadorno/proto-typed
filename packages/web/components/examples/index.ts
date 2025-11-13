/**
 * Export all example components for easy importing
 */

// Layout Examples
export { default as LayoutExamples } from './layout';
export { default as FormExamples } from './forms';
export { default as InteractiveExamples } from './interactive';
export { default as DisplayExamples } from './display';
export { default as MobileExamples } from './mobile';

// Main example modal
export { default as ExampleModal } from './example-modal';

// Types
export type { ExampleCategory, Example, ExampleData } from './types';

// Simple example configs for playground
export const exampleConfigs = [
  {
    label: 'Simple Card',
    code: `app "Hello World" {
  screen "main" {
    layout type="container" {
      layout type="card" {
        heading content="Welcome" level=1
        text content="This is a simple example"
        button text="Click Me" variant="primary"
      }
    }
  }
}`
  },
  {
    label: 'Form Example',
    code: `app "Form Example" {
  screen "main" {
    layout type="container" {
      heading content="Sign Up" level=2
      input name="email" placeholder="Email" type="email"
      input name="password" placeholder="Password" type="password"
      button text="Submit" variant="primary"
    }
  }
}`
  }
];
