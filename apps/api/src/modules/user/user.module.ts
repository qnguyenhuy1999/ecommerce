import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

 
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
 

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class UserModule {}
