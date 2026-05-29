export const shippingKeys = {
  all: ['shipping'] as const,
  bundle: () => ['shipping', 'bundle'] as const,
}
