export class RegisterCommand {
  constructor(
    readonly email: string,
    readonly password: string,
    readonly firstName?: string,
    readonly lastName?: string,
  ) {}
}
