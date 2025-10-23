export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function extractText(node: unknown): string {
  if (node == null) {
    return ''
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join('')
  }

  if (
    typeof node === 'object' &&
    'props' in (node as Record<string, unknown>)
  ) {
    const children = (node as { props: { children?: unknown } }).props?.children
    return extractText(children)
  }

  return ''
}
