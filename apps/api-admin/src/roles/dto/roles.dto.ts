import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsEnum, ArrayUnique } from 'class-validator'
import { AdminPermission, AdminRoleType } from '@ecom/database'

export class RoleResponseDto {
  @ApiProperty() id!: string
  @ApiProperty({ enum: AdminRoleType }) name!: AdminRoleType
  @ApiPropertyOptional() description!: string | null
  @ApiProperty() memberCount!: number
  @ApiProperty({ enum: AdminPermission, isArray: true }) permissions!: AdminPermission[]
  @ApiProperty() createdAt!: Date
  @ApiProperty() updatedAt!: Date
}

export class UpdateRolePermissionsDto {
  @ApiProperty({ enum: AdminPermission, isArray: true })
  @IsArray()
  @ArrayUnique()
  @IsEnum(AdminPermission, { each: true })
  permissions!: AdminPermission[]
}
