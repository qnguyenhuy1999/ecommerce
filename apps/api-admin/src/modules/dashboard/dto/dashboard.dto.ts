import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class DashboardSellerUserDto {
  @ApiProperty() email!: string
}

export class DashboardRecentSellerDto {
  @ApiProperty() id!: string
  @ApiProperty() shopName!: string
  @ApiProperty() status!: string
  @ApiProperty() createdAt!: Date
  @ApiProperty({ type: DashboardSellerUserDto }) user!: DashboardSellerUserDto
}

export class DashboardOrdersByDayDto {
  @ApiProperty({ example: '2026-05-01' }) date!: string
  @ApiProperty() revenue!: number
}

export class DashboardTopCategoryDto {
  @ApiProperty() categoryId!: string
  @ApiProperty() count!: number
}

export class DashboardMetricsDto {
  @ApiProperty() totalSellers!: number
  @ApiProperty() activeSellers!: number
  @ApiProperty() pendingSellers!: number
  @ApiProperty() totalUsers!: number
  @ApiProperty() totalOrders!: number
  @ApiProperty() totalProducts!: number
  @ApiProperty() pendingRefunds!: number
  @ApiProperty() totalReviews!: number
  @ApiProperty({ type: DashboardRecentSellerDto, isArray: true })
  recentSellers!: DashboardRecentSellerDto[]
}

export class AnalyticsQueryDto {
  @ApiPropertyOptional({ example: '30d' })
  @IsOptional()
  @IsString()
  period?: string
}

export class DashboardAnalyticsDto {
  @ApiProperty({ type: 'number', format: 'double' })
  totalRevenue!: number

  @ApiProperty({ type: 'number', format: 'double', nullable: true }) revenueTrendPercent!:
    | number
    | null

  @ApiProperty({ type: DashboardOrdersByDayDto, isArray: true })
  ordersByDay!: DashboardOrdersByDayDto[]

  @ApiProperty({ type: DashboardTopCategoryDto, isArray: true })
  topCategories!: DashboardTopCategoryDto[]
}
