export const productKeys = {
  all: ['products'] as const,
  list: () => ['products', 'list'] as const,
  categories: () => ['products', 'categories'] as const,
}
