import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator'

import { type AuthenticatedUser, CurrentUser, JwtAccessGuard } from '@ecom/nest-auth'

import { ReviewService, type ReviewView } from './review.service'

class CreateReviewDto {
  @IsString()
  orderId!: string

  @IsString()
  productId!: string

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string
}

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviews: ReviewService) {}

  @Get()
  @ApiOperation({ summary: 'List product reviews.' })
  async list(@Query('productId') productId?: string): Promise<{ success: true; data: ReviewView[] }> {
    return { success: true, data: await this.reviews.list(productId) }
  }

  @Post()
  @UseGuards(JwtAccessGuard)
  @ApiCookieAuth('access_token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a verified buyer review.' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateReviewDto,
  ): Promise<{ success: true; data: ReviewView }> {
    return { success: true, data: await this.reviews.create(user.userId, dto) }
  }

  @Get('products/:productId')
  @ApiOperation({ summary: 'List reviews for a product.' })
  async listForProduct(@Param('productId') productId: string): Promise<{ success: true; data: ReviewView[] }> {
    return { success: true, data: await this.reviews.list(productId) }
  }
}
