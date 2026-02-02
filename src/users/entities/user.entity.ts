import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CatEntity } from 'src/cats/entities/cat.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: Добавить колонки firstName и lastName
  
  // TODO: Настроить связь OneToMany к CatEntity
  cats: any[];
}