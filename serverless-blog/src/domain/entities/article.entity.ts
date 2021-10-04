import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../models'

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(type => User, user => user.articles)
  author: User;
}