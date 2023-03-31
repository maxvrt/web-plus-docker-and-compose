import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Length, IsUrl } from 'class-validator';
import { User } from '../../users/entity/User';
import { Offer } from '../../offers/entity/Offer';

// Схема для подарков
@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;
  @Column()
  link: string;
  @Column({ nullable: true })
  @IsUrl()
  image: string;
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
  // сколько сейчас готовы скинуть на подарок
  // Todo проверить тип, нужен float или double?
  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  raised: number;
  // user который добавил пожелание подарка
  @ManyToOne(() => User, (user) => user.wishes, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  owner: User;
  @Column({ nullable: true })
  @Length(1, 1024)
  description: string;
  // массив ссылок на заявки скинуться от других пользователей
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
  @Column({ default: 0 }) // cчётчик тех, кто скопировал подарок себе
  copied: number;
}
