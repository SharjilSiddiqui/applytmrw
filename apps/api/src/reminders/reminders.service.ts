import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, opportunityId: string, dto: CreateReminderDto) {
    const opportunity = await this.prisma.opportunity.findFirst({
      where: {
        id: opportunityId,
        userId,
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    return this.prisma.reminder.create({
      data: {
        opportunityId,
        type: dto.type,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async findAll(userId: string, opportunityId: string) {
    const opportunity = await this.prisma.opportunity.findFirst({
      where: {
        id: opportunityId,
        userId,
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    return this.prisma.reminder.findMany({
      where: {
        opportunityId,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });
  }

  async findUpcoming(userId: string) {
    return this.prisma.reminder.findMany({
      where: {
        completed: false,

        scheduledAt: {
          gte: new Date(),
        },

        opportunity: {
          userId,
        },
      },

      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            company: true,
            url: true,
          },
        },
      },

      orderBy: {
        scheduledAt: 'asc',
      },
    });
  }

  async complete(userId: string, opportunityId: string, reminderId: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: {
        id: reminderId,
        opportunityId,
        opportunity: {
          userId,
        },
      },
    });

    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }

    return this.prisma.reminder.update({
      where: {
        id: reminderId,
      },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  async remove(userId: string, opportunityId: string, reminderId: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: {
        id: reminderId,
        opportunityId,
        opportunity: {
          userId,
        },
      },
    });

    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }

    return this.prisma.reminder.delete({
      where: {
        id: reminderId,
      },
    });
  }
}
