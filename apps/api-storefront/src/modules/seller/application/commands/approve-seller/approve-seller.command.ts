export class ApproveSellerCommand {
  constructor(
    readonly sellerId: string,
    readonly adminUserId: string,
  ) {}
}
