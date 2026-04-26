import { IsIn, IsNotEmpty, IsString } from 'class-validator'

export class CreatePaymentIntentDto {
  @IsString()
  @IsNotEmpty()
  orderId!: string

  @IsString()
  @IsIn(['stripe'])
  paymentMethod!: 'stripe'

  @IsString()
  @IsNotEmpty()
  idempotencyKey!: string
}
