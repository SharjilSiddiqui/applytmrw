import { IsEnum, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import {
  OpportunitySource,
  OpportunityStatus,
} from '../../generated/prisma/enums';

export class CreateOpportunityDto {
  @IsUrl()
  url: string;

  @IsOptional()
  @IsEnum(OpportunitySource)
  source?: OpportunitySource;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(OpportunityStatus)
  status?: OpportunityStatus;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
