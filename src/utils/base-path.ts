/**
 * Get the base path for the application
 * In development: /
 * In production: /proto-typed/
 */
export function getBasePath(): string {
  return import.meta.env.BASE_URL || '/';
}

/**
 * Create a URL with the correct base path
 * @param path - The path without the base (e.g., "/docs" or "/")
 * @returns The full path with base (e.g., "/proto-typed/docs" in production)
 */
export function withBase(path: string): string {
  const base = getBasePath();
  // Remove trailing slash from base and leading slash from path to avoid double slashes
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Handle root path
  if (cleanPath === '/') {
    return base;
  }
  
  return `${cleanBase}${cleanPath}`;
}
