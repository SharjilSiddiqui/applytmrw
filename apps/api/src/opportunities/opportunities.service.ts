import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';

import { OpportunityMetadataService } from './services/opportunity-metadata.service';

@Injectable()
export class OpportunitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly opportunityMetadataService: OpportunityMetadataService,
  ) {}

  async create(userId: string, dto: CreateOpportunityDto) {
    const extractedMetadata = await this.opportunityMetadataService.extract(
      dto.url,
    );

    const { metadata, ...data } = dto;

    return this.prisma.opportunity.create({
      data: {
        ...data,

        title: data.title ?? extractedMetadata.title,

        company: data.company ?? extractedMetadata.company,

        description: data.description ?? extractedMetadata.description,

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
