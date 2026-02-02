import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// TODO: Настроить декоратор Entity и описать поля таблицы
@Entity('cats')
export class CatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  // TODO: Добавить остальные поля (age, breed, history, description)
  // Помните про типы данных и возможность пустых значений (nullable)
}