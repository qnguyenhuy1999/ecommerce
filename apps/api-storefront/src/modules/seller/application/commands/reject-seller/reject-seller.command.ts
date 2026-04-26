export class RejectSellerCommand {
  constructor(
    readonly sellerId: string,
    readonly adminUserId: string,
    readonly reason?: string,
  ) {}
}
