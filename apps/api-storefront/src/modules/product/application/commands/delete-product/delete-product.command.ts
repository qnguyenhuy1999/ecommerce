export class DeleteProductCommand {
  constructor(
    readonly productId: string,
    readonly userId: string,
  ) {}
}
