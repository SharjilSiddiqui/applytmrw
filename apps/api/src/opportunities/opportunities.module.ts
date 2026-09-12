import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from '../auth/auth.module';
import { OpportunitiesController } from './opportunities.controller';
import { OpportunitiesService } from './opportunities.service';
import { OpportunityMetadataService } from './services/opportunity-metadata.service';

@Module({
  imports: [
    AuthModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService, OpportunityMetadataService],
})
export class OpportunitiesModule {}
