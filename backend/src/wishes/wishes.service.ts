import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entity/Wish';
import { FindManyOptions, In, Repository, UpdateResult } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entity/User';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}
  async findAll(): Promise<Wish[]> {
    return this.wishRepository.find();
  }
  async findOne(id: number): Promise<Wish> {
    // обращение к базе с запросом нужных зависимостей
    const wish: Wish = await this.wishRepository.findOne({
      relations: {
        owner: true,
        offers: {
          user: {
            wishlists: {
              owner: true,
              items: true,
            },
          },
        },
      },
      where: { id },
    });
    if (wish) {
      let newWish = { ...wish };
      if (wish?.offers)
        newWish = {
          ...wish,
          offers: wish.offers
            .filter((offer) => offer.hidden === false)
            .map((offer) => ({
              ...offer,
              user: {
                ...offer.user,
                password: undefined,
              },
            })),
        };
      delete newWish.owner?.email;
      if (newWish.offers)
        newWish.offers.map((of) => {
          of.user.wishlists.map((wl) => {
            wl.owner.email = undefined;
            wl.itemsId = undefined;
          });
        });
      return newWish;
    }
    return null;
  }
  async create(createWishDto: CreateWishDto, user: User): Promise<string> {
    const wish = this.wishRepository.create({ ...createWishDto, owner: user });
    await this.wishRepository.save(wish);
    return '{}';
  }
  async updateByOwner(
    id: number,
    updateWishDto: UpdateWishDto,
    user: User,
  ): Promise<string> {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: ['owner'],
    });
    if (user.id === wish.owner.id && wish.raised < 0.1) {
      await this.wishRepository.update({ id: id }, updateWishDto);
      return '{}';
    } else {
      throw new UnauthorizedException('Это желание нельзя редактировать');
    }
  }
  async updateByCopied(id: number): Promise<UpdateResult> {
    const wish = await this.wishRepository.findOneBy({ id: id });
    const newCopied = wish.copied + 1;
    return await this.wishRepository.update({ id: id }, { copied: newCopied });
  }
  async updateByRised(id: number, newRised: number): Promise<UpdateResult> {
    return await this.wishRepository.update({ id: id }, { raised: newRised });
  }
  async findLastMany(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      relations: {
        owner: true,
        offers: {
          user: {
            wishlists: {
              owner: true,
              items: true,
            },
          },
        },
      },
      order: { id: 'DESC' },
      take: 40,
    });
    this.mapForWishes(wishes);
    return wishes;
  }
  async findTop(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      relations: {
        owner: true,
        offers: {
          user: {
            wishlists: {
              owner: true,
              items: true,
            },
          },
        },
      },
      order: { copied: 'DESC' },
      take: 20,
    });
    this.mapForWishes(wishes);
    return wishes;
  }
  async remove(id: number, userId) {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: ['owner'],
    });
    if (wish.owner.id === userId) {
      wish.owner.email = undefined;
      if (wish.offers && wish.offers.length > 0)
        wish.offers.map((of) => {
          of.user.wishlists.map((wl) => {
            if (wl.owner?.email) wl.owner.email = undefined;
            if (wl.itemsId) wl.itemsId = undefined;
          });
        });
      await this.wishRepository.delete({ id });
    } else throw new UnauthorizedException('Чужое желание нельзя удалить');
    return wish;
  }
  async findWishesByMe(id: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      relations: {
        owner: true,
        offers: {
          user: {
            wishlists: {
              owner: true,
              items: true,
            },
          },
        },
      },
      where: { owner: { id } },
      order: { id: 'DESC' },
    });
    this.mapForWishes(wishes);
    return wishes;
  }
  async findWishesByOwner(id: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      relations: {
        offers: {
          user: {
            wishlists: {
              owner: true,
              items: true,
            },
            wishes: {
              owner: true,
            },
            offers: {
              user: true,
            },
          },
          item: { owner: true },
        },
      },
      where: { owner: { id } },
      order: { id: 'DESC' },
    });
    wishes.map((item) => {
      item.offers.map((of) => {
        if (of.item.owner?.email) of.item.owner.email = undefined;
        of.user.wishes.map((w) => {
          if (w.owner?.email) w.owner.email = undefined;
        });
        of.user.offers.map((off) => {
          if (off.user?.email) off.user.email = undefined;
        });
        of.user.wishlists.map((wl) => {
          if (wl.owner?.email) wl.owner.email = undefined;
        });
      });
    });
    return wishes;
  }
  findMany(items: number[]): Promise<Wish[]> {
    return this.wishRepository.findBy({ id: In(items) });
  }
  mapForWishes(wishesArray) {
    wishesArray.map((item) => {
      if (item.owner?.email) item.owner.email = undefined;
      item.offers.map((of) => {
        of.user.wishlists.map((wl) => {
          if (wl.owner?.email) wl.owner.email = undefined;
          if (wl.itemsId) wl.itemsId = undefined;
        });
      });
    });
  }
}
