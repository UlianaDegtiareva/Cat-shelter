import { Module } from '@nestjs/common';
import { RosKotPermController } from './roskot-perm.controller';

@Module({
  controllers: [RosKotPermController],
})
export class ExternalApiModule {}