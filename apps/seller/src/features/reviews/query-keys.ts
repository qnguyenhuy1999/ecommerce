export const reviewKeys = {
  all: ['reviews'] as const,
  bundle: () => ['reviews', 'bundle'] as const,
}
