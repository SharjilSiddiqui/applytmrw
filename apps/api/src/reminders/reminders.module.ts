import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';

@Module({
  imports: [
    AuthModule,
    PrismaModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [RemindersController],
  providers: [RemindersService],
})
export class RemindersModule {}
