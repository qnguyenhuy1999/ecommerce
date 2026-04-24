export class RemoveCartItemCommand {
  constructor(
    readonly userId: string,
    readonly cartItemId: string,
  ) {}
}
