import { Module } from '@nestjs/common'

import { AuthModule } from '@ecom/nest-auth'

import { ReviewController } from './review.controller'
import { ReviewService } from './review.service'

@Module({
  imports: [AuthModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS module class requires empty body
export class ReviewModule {}
