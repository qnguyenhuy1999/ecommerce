export class LogoutCommand {
  constructor(
    readonly userId: string,
    readonly accessTokenJti: string,
    readonly accessTokenRemainingTtlSeconds: number,
    readonly rawRefreshToken?: string,
  ) {}
}
