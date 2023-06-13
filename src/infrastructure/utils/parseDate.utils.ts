export function parseDate(dateDecision: string) {
  const year = dateDecision.substring(0, 4),
    month = dateDecision.substring(5, 7),
    date = dateDecision.substring(8, 10)

  return new Date(parseInt(year), parseInt(month) - 1, parseInt(date))
}
