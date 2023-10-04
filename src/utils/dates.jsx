export const date = (ymd, options = {}) => new Date(Date.parse(ymd)).toLocaleString('da-DK', { weekday: 'short', month: 'long', day: 'numeric', ...options })
export const compDays = (s, e, options = {}) => s === e ? date(s, options) : `${date(s, options)} - ${date(e, options)}`

