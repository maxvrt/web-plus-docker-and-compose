import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entity/Wishlist';
import { User } from '../users/entity/User';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishesService } from '../wishes/wishes.service';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}
  async findAll(): Promise<Wishlist[]> {
    const wishList = await this.wishlistRepository.find({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        itemsId: false,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
    wishList.map((item) => {
      item.owner.email = undefined;
    });
    return wishList;
  }
  async findOne(id: number): Promise<Wishlist> {
    const newList = await this.wishlistRepository.findOne({
      where: { id: id },
      relations: ['items', 'owner'],
    });
    newList.owner.email = undefined;
    newList.itemsId = undefined;
    return newList;
  }
  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const items = await this.wishesService.findMany(createWishlistDto.itemsId);
    const newList = await this.wishlistRepository.save({
      ...createWishlistDto,
      owner: user,
      items,
    });
    newList.owner.email = undefined;
    newList.itemsId = undefined;
    newList.description = undefined;
    return newList;
  }
  async update(id: number, updateWishlistDto: UpdateWishlistDto, user: User) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: id },
      relations: ['items', 'owner'],
    });
    if (user.id === wishlist.owner.id && updateWishlistDto.itemsId) {
      // Удаляем желания не из списка
      // Проходим по всем желаниям (items)
      wishlist.items.map((wishItem) => {
        if (!updateWishlistDto.itemsId.includes(wishItem.id))
          wishlist.items = wishlist.items.filter((item) => item !== wishItem);
      });
      // Добавляем в items желания из списка
      const wishes = await this.wishesService.findMany(
        updateWishlistDto.itemsId,
      );
      wishlist.items.push(...wishes);
      await this.wishlistRepository.save(wishlist);
      await this.wishlistRepository.update(id, {
        ...updateWishlistDto,
      });
      const newList = await this.wishlistRepository.findOne({
        where: { id: id },
        relations: ['items', 'owner'],
      });
      newList.owner.email = undefined;
      newList.itemsId = undefined;
      newList.description = undefined;
      return newList;
    }
    throw new UnauthorizedException('Список не получается отредактировать');
  }
  async delete(id: number) {
    const newList = await this.wishlistRepository.findOne({
      where: { id: id },
      relations: ['items', 'owner'],
    });
    if (newList) {
      newList.owner.email = undefined;
      newList.itemsId = undefined;
      await this.wishlistRepository.delete(id);
      return newList;
    }
    throw new NotFoundException('Список не найден');
  }
}
