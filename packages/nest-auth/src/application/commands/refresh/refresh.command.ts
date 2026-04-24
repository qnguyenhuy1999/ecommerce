export class RefreshCommand {
  constructor(
    readonly userId: string,
    readonly family: string,
    readonly jti: string,
  ) {}
}
