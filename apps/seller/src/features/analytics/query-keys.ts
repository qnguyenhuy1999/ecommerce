export const analyticsKeys = {
  all: ['analytics'] as const,
  bundle: (range: string) => ['analytics', 'bundle', range] as const,
}
