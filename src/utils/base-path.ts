const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const EXTERNAL_PATTERN = /^(?:[a-z][a-z0-9+\-.]*:|\/\/)/i

const ensureLeadingSlash = (path: string) => (path.startsWith("/") ? path : `/${path}`)

const alreadyPrefixed = (path: string) =>
  PUBLIC_BASE_PATH && (path.startsWith(PUBLIC_BASE_PATH) || path.startsWith(`${PUBLIC_BASE_PATH}/`))

const shouldBypass = (path: string) =>
  !path ||
  path.startsWith("#") ||
  EXTERNAL_PATTERN.test(path) ||
  path.startsWith("data:") ||
  path.startsWith("blob:")

export const withBasePath = (path: string) => {
  if (shouldBypass(path) || alreadyPrefixed(path)) {
    return path
  }

  const normalized = ensureLeadingSlash(path)
  return `${PUBLIC_BASE_PATH}${normalized}`
}

export const withAssetPath = (path: string) => {
  if (shouldBypass(path) || alreadyPrefixed(path)) {
    return path
  }

  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${PUBLIC_BASE_PATH}${normalized}`
}

