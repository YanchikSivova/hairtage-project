export function normalizeStoredImagePath(path) {
  if (!path) return ''

  let normalized = String(path).trim()

  normalized = normalized.replace(/\\/g, '/')
  normalized = normalized.replace(/^\/+/, '')
  normalized = normalized.replace(/^\.?\//, '')
  normalized = normalized.replace(/^src\//i, '')
  normalized = normalized.replace(/^public\//i, '')

  if (!/^assets\//i.test(normalized)) {
    normalized = `assets/${normalized}`
  }

  normalized = normalized.replace(/\.jpeg$/i, '.jpg')

  return normalized
}

export function getPublicImagePath(path) {
  const normalized = normalizeStoredImagePath(path)

  if (!normalized) return ''

  return `/${normalized}`
}

export function getAlternateImagePath(path) {
  if (!path) return ''

  if (/\.jpeg$/i.test(path)) {
    return path.replace(/\.jpeg$/i, '.jpg')
  }

  if (/\.jpg$/i.test(path)) {
    return path.replace(/\.jpg$/i, '.jpeg')
  }

  return path
}