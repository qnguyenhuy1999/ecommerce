import type { ListSellerLedgerDto } from '../../dtos/list-seller-ledger.dto'

export class ListSellerLedgerQuery {
  constructor(
    public readonly sellerId: string,
    public readonly filters: ListSellerLedgerDto,
  ) {}
}
