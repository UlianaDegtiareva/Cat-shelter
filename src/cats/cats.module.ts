import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CatEntity } from './entities/cat.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatEntity, UserEntity])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}