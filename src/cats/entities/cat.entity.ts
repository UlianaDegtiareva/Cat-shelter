import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ nullable: true })
  history: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}