import { Controller, Get, UseGuards } from '@nestjs/common';
import { API_ROUTES } from '@shared/constants/routes.constants';
import { generateLink } from '@shared/utils/route.utils';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { JobService } from './job.service';

@Controller(generateLink({ route: [API_ROUTES.JOB.BASE] }))
@AllowAnonymous()
@UseGuards(ApiKeyGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get(API_ROUTES.JOB.SYNC_POSITIONS)
  async syncPositions() {
    return this.jobService.syncPositions();
  }
}
