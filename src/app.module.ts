import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CatsModule } from './cats/cats.module';
import { CatEntity } from './cats/entities/cat.entity';
import { UserEntity } from './users/entities/user.entity';
import { StatsModule } from './stats/stats.module';
import { AuthModule } from './auth/auth.module';
import { Role } from './roles/entities/role.entity';
import { HealthCard } from './cats/entities/health-card.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Имя сервиса из docker-compose.yml
      host: 'db', 
      // Внутри сети Docker порт базы всегда стандартный
      port: 5432, 
      username: 'user',
      password: 'password',
      database: 'shelter',
      entities: [CatEntity, UserEntity, Role, HealthCard],
      // Включает авто-создание таблиц (удобно для курсовой)
      synchronize: true, 
    }),
    AuthModule,
    CatsModule,
    UsersModule,
    StatsModule,
  ],
})
export class AppModule {}