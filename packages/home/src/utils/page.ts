// 将 URL 中的 page 规整为不小于 1 的整数，NaN / 0 / 负数一律回退到第 1 页
export function sanitizePage(value: unknown): number {
  const page = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value)
  return Number.isInteger(page) && page >= 1 ? page : 1
}
