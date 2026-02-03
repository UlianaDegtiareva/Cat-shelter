import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CatEntity } from 'src/cats/entities/cat.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => CatEntity, (cat) => cat.owner)
  cats: CatEntity[];
}