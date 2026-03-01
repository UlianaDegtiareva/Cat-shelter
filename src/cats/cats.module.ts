import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CatEntity } from './entities/cat.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { HealthCard } from './entities/health-card.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [
    TypeOrmModule.forFeature([CatEntity, UserEntity, HealthCard, Role]),
    HttpModule,   
    ConfigModule, 
  ],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}