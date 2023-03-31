import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from './entity/Offer';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}
  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Offer> {
    return this.offersService.findOne(Number(id));
  }
  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    return this.offersService.create(createOfferDto, req.user);
  }
}
