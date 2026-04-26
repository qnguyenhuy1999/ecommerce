import { Type } from 'class-transformer'
import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

export const ADMIN_ORDER_TRANSITION_TARGETS = [
  'PROCESSING',
  'SHIPPED',
  'COMPLETED',
  'CANCELLED',
] as const
export type AdminOrderTransitionTarget = (typeof ADMIN_ORDER_TRANSITION_TARGETS)[number]

export class ShippingTrackingDto {
  @IsString()
  @IsNotEmpty()
  carrier!: string

  @IsString()
  @IsNotEmpty()
  trackingNumber!: string
}

export class TransitionOrderStatusDto {
  @IsIn(ADMIN_ORDER_TRANSITION_TARGETS)
  status!: AdminOrderTransitionTarget
}

export class TransitionSubOrderStatusDto {
  @IsIn(ADMIN_ORDER_TRANSITION_TARGETS)
  status!: AdminOrderTransitionTarget

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingTrackingDto)
  shippingTracking?: ShippingTrackingDto
}
