export function normalizeGoogleCalendarEmbedUrl(value) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return ''

  try {
    const url = new URL(trimmed)
    const isGoogleCalendarEmbed = url.protocol === 'https:'
      && url.hostname === 'calendar.google.com'
      && url.pathname === '/calendar/embed'

    return isGoogleCalendarEmbed ? url.toString() : null
  } catch {
    return null
  }
}

export function getStyledGoogleCalendarEmbedUrl(value) {
  const normalized = normalizeGoogleCalendarEmbedUrl(value)
  if (!normalized) return normalized

  const url = new URL(normalized)
  url.searchParams.set('mode', 'AGENDA')
  url.searchParams.set('showTitle', '0')
  url.searchParams.set('showNav', '1')
  url.searchParams.set('showPrint', '0')
  url.searchParams.set('showTabs', '0')
  url.searchParams.set('showCalendars', '0')
  url.searchParams.set('showTz', '0')
  url.searchParams.set('bgcolor', '#faf9f7')
  return url.toString()
}

export function isGoogleCalendarEmbedUrl(value) {
  return normalizeGoogleCalendarEmbedUrl(value) !== null
}
