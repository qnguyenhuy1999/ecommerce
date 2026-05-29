export const metricsKeys = {
  all: ['metrics'] as const,
  bundle: () => ['metrics', 'bundle'] as const,
}
