import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('cats')
export class CatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;

  @Column({ type: 'text', nullable: true })
  history: string;

  @Column({ nullable: true })
  description: string;

  // TODO: Добавить флаг isAdopted (boolean, default: false)
  // TODO: Добавить дату adoptionDate (тип timestamp, nullable)

  // TODO: Настроить связь ManyToOne к UserEntity
  // TODO: Установить onDelete: 'SET NULL'
  owner: any;
}