/**
 * Utility to resolve asset paths with base path support
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function withAssetPath(path: string): string {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalizedPath}`;
}

// Alias for compatibility
export const withBasePath = withAssetPath;

export function resolveAssetPath(path: string): string {
  return withAssetPath(path);
}
