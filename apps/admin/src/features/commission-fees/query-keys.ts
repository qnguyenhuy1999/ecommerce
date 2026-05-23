export const commissionFeeKeys = {
  all: ['commission-fees'] as const,
  lists: () => [...commissionFeeKeys.all, 'list'] as const,
}
