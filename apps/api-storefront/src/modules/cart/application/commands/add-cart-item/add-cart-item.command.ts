export class AddCartItemCommand {
  constructor(
    readonly userId: string,
    readonly variantId: string,
    readonly quantity: number,
  ) {}
}
