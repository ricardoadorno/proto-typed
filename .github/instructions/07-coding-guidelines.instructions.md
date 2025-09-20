# Coding Guidelines

## Styling
- Dark mode only; do not use `dark:` Tailwind prefixes.
- Prefer `bg-gray-800`, `text-gray-300`, `border-gray-700`.

## TypeScript
- Prefer `interface` for object shapes; use discriminated unions for AST nodes (`type` field required).
- Handle null/undefined explicitly.
- Use generics with constraints where applicable.

## React
- Functional components with hooks.
- Local state preferred; add error boundaries around parsing/rendering.
- Semantic HTML; keep components focused and reusable.

## Performance
- Reset parser state between inputs.
- Efficient regex; avoid catastrophic backtracking.
- Debounce editor updates; memoize expensive renders.

## Error Handling
- Provide meaningful messages with line/column context.
- Gracefully handle malformed input; partial recovery when possible.

## Testing & Validation
- Do not add automated tests unless requested.
- Validate via runtime behavior and user feedback.
