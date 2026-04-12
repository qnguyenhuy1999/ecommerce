import { Module } from '@nestjs/common';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
 

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AdminModule {}