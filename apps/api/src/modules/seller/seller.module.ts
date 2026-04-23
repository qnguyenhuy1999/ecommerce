import { Module } from '@nestjs/common';

import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';

 
@Module({
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService],
})
 

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class SellerModule {}
