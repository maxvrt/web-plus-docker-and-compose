import { Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entity/User';
import { Wish } from '../../wishes/entity/Wish';
import { IsNumber } from 'class-validator';

export class CreateOfferDto {
  // id пользователя желающего скинуться
  @ManyToOne(() => User, (user) => user.offers)
  user: User;
  // ссылка на товар
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
  // сумма заявки
  @Column({
    scale: 2,
    default: 0,
  })
  @IsNumber()
  amount: number;
  @Column('boolean', { default: false }) // показывать ли информацию о скидывающемся в списке
  hidden: false;
  @IsNumber()
  itemId: number;
}
