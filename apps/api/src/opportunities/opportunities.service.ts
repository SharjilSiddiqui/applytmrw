import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateOpportunityDto) {
    const { metadata, ...data } = dto;

    return this.prisma.opportunity.create({
      data: {
        ...data,
        userId,
        ...(metadata !== undefined && {
          metadata: metadata as Prisma.InputJsonValue,
        }),
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.opportunity.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const opportunity = await this.prisma.opportunity.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    return opportunity;
  }

  async update(userId: string, id: string, dto: UpdateOpportunityDto) {
    await this.findOne(userId, id);

    const { metadata, ...data } = dto;

    return this.prisma.opportunity.update({
      where: {
        id,
      },
      data: {
        ...data,
        ...(metadata !== undefined && {
          metadata: metadata as Prisma.InputJsonValue,
        }),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.opportunity.delete({
      where: {
        id,
      },
    });
  }
}
