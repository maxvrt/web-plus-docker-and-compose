import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entity/Offer';
import { Repository } from 'typeorm';
import { User } from '../users/entity/User';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}
  async findAll(): Promise<Offer[]> {
    const offers = await this.offerRepository.find({
      relations: {
        item: {
          owner: true,
        },
        user: {
          wishes: { owner: true },
          offers: { user: true },
          wishlists: { owner: true, items: true },
        },
      },
    });
    offers.map((of) => {
      of.item.owner.email = undefined;
      of.user.wishes.map((ws) => {
        ws.owner.email = undefined;
      });
      of.user.offers.map((off) => {
        off.user.email = undefined;
      });
    });
    return offers;
  }
  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      relations: {
        item: {
          owner: true,
        },
        user: {
          wishes: { owner: true },
          offers: { user: true },
          wishlists: { owner: true, items: true },
        },
      },
      where: { id: id },
    });
    offer.item.owner.email = undefined;
    offer.user.wishes.map((ws) => {
      ws.owner.email = undefined;
    });
    offer.user.offers.map((off) => {
      off.user.email = undefined;
    });
    offer.user.wishlists.map((wl) => {
      wl.owner.email = undefined;
      wl.itemsId = undefined;
    });
    return offer;
  }
  async create(createOfferDto: CreateOfferDto, user: User): Promise<string> {
    const newId = Number(createOfferDto.itemId);
    const wish = await this.wishesService.findOne(newId);
    if (wish) {
      const newRised = wish.raised + Number(createOfferDto.amount);
      await this.wishesService.updateByRised(wish.id, newRised);
      await this.offerRepository.save({
        ...createOfferDto,
        user,
        item: wish,
      });
      return '{}';
    } else throw new NotFoundException();
  }
}
