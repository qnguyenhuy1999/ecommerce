export class UpdateCartItemCommand {
  constructor(
    readonly userId: string,
    readonly cartItemId: string,
    readonly quantity: number,
  ) {}
}
