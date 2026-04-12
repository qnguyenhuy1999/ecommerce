import { Module } from '@nestjs/common';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

 
@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
 

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class NotificationModule {}