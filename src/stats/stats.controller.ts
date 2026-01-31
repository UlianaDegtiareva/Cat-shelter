import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('Statistics')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get general shelter metrics' })
  @ApiResponse({ status: 200, description: 'Total counts and adoption percentage' })
  getSummary() {
    return this.statsService.getGeneralSummary();
  }

  @Get('breeds')
  @ApiOperation({ summary: 'Distribution of cats by breeds' })
  @ApiResponse({ status: 200, description: 'List of breeds with counts' })
  getBreedStats() {
    return this.statsService.getBreedDistribution();
  }

  @Get('top-adopters')
  @ApiOperation({ 
    summary: 'Get most active adopters', 
    description: 'Returns top 5 users who have adopted the most cats' 
  })
  @ApiResponse({ status: 200, description: 'List of top adopters' })
  getTopAdopters() {
    return this.statsService.getTopAdopters();
  }
}