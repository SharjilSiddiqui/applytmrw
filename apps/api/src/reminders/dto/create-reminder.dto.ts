import { IsDateString, IsEnum } from 'class-validator';

import { ReminderType } from '../../generated/prisma/enums';

export class CreateReminderDto {
  @IsEnum(ReminderType)
  type: ReminderType;

  @IsDateString()
  scheduledAt: string;
}
