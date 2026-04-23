import { Module, Global } from '@nestjs/common';

import { PrismaService } from './prisma.service';

 
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})


// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class PrismaModule {}
