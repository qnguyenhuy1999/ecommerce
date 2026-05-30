import {
  createVoucher,
  getVouchersBundle as getVouchersBundleBase,
} from '../integration/seller-page-api'

export function getVouchersBundle(init?: RequestInit) {
  return getVouchersBundleBase(init)
}

export { createVoucher }
