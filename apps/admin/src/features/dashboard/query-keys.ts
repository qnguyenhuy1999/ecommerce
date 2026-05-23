export const dashboardKeys = {
  all: ['dashboard'] as const,
  metrics: () => [...dashboardKeys.all, 'metrics'] as const,
  analytics: (period?: string) => [...dashboardKeys.all, 'analytics', period] as const,
}
