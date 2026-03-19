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

  @Column({ default: false })
  isAdopted: boolean;

  @Column({ type: 'text', nullable: true })
  history: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  adoptionDate: Date; // Дата усыновления

  @ManyToOne(() => UserEntity, (user) => user.cats, { onDelete: 'SET NULL' })
  owner: UserEntity
}