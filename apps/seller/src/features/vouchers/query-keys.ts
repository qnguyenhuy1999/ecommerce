export const voucherKeys = {
  all: ['vouchers'] as const,
  bundle: () => ['vouchers', 'bundle'] as const,
}
