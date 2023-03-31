import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Wish } from '../../wishes/entity/Wish';
import { Offer } from '../../offers/entity/Offer';
import { Wishlist } from '../../wishlists/entity/Wishlist';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column() // от 2 до 30
  @Length(2, 30)
  username: string;
  @Column('varchar', {
    default: 'Пока ничего не рассказал о себе',
  }) // от 2 до 200
  @Length(2, 200)
  about: string;
  //@IsUrl()
  @Column('varchar', {
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;
  @Column('varchar', { unique: true }) // email уникальный
  @IsEmail()
  email: string;
  @Exclude()
  @Column({ select: false }) // пароль, строка
  @IsNotEmpty()
  password: string;
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];
  // список подарков на которые скидывается польз. связь
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
  // список вишлистов созданных польз.
  @OneToMany(() => Wishlist, (wishList) => wishList.owner)
  wishlists: Wishlist[];
}
