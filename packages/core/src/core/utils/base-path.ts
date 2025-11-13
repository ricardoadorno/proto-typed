/**
 * Base path utilities for Proto-Typed
 */

/**
 * Get base path for assets
 * In production (GitHub Pages): uses repository name
 * In development: empty string
 */
export function getBasePath(): string {
  // For core package, we don't have Next.js basePath
  // Return empty string, let the consuming app handle it
  return ''
}

/**
 * Resolve asset path with base path
 */
export function resolveAssetPath(path: string): string {
  const basePath = getBasePath()

  // Remove leading slash from path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  // Combine base path and clean path
  return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`
}

/**
 * Alias for resolveAssetPath (for backward compatibility)
 */
export function withAssetPath(path: string): string {
  return resolveAssetPath(path)
}
