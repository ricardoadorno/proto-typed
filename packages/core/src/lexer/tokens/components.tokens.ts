import { createToken } from 'chevrotain'

// Component System Tokens - Reusable component definitions and instances
export const Component = createToken({
  name: 'Component',
  pattern: /component/,
  label: 'component',
})

export const ComponentInstance = createToken({
  name: 'ComponentInstance',
  pattern: /\$[A-Z][A-Za-z0-9]*/,
  label: '$ComponentName',
})

export const PropVariable = createToken({
  name: 'PropVariable',
  pattern: /\$(?:[a-z][a-zA-Z0-9]*)(?:-[a-z][a-zA-Z0-9]*)*/,
  label: '$propName',
})
