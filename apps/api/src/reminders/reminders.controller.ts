import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { RemindersService } from './reminders.service';

@Controller('opportunities/:opportunityId/reminders')
@UseGuards(JwtAuthGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Param('opportunityId') opportunityId: string,
    @Body() dto: CreateReminderDto,
  ) {
    return this.remindersService.create(user.id, opportunityId, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: { id: string },
    @Param('opportunityId') opportunityId: string,
  ) {
    return this.remindersService.findAll(user.id, opportunityId);
  }

  @Patch(':reminderId/complete')
  complete(
    @CurrentUser() user: { id: string },
    @Param('opportunityId') opportunityId: string,
    @Param('reminderId') reminderId: string,
  ) {
    return this.remindersService.complete(user.id, opportunityId, reminderId);
  }

  @Delete(':reminderId')
  remove(
    @CurrentUser() user: { id: string },
    @Param('opportunityId') opportunityId: string,
    @Param('reminderId') reminderId: string,
  ) {
    return this.remindersService.remove(user.id, opportunityId, reminderId);
  }
}
