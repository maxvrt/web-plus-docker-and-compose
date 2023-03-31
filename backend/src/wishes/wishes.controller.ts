import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Wish } from './entity/Wish';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}
  @Get('last')
  async findLastMany(): Promise<Wish[]> {
    return this.wishesService.findLastMany();
  }
  @Get('top')
  topWishes() {
    return this.wishesService.findTop();
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req): Promise<Wish> {
    //console.log(`${JSON.stringify(req.user)}`);
    return this.wishesService.findOne(Number(id));
  }
  @Get()
  async findAll(): Promise<Wish[]> {
    return this.wishesService.findAll();
  }
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createWishDto: CreateWishDto, @Req() req) {
    return this.wishesService.create(createWishDto, req.user);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    return await this.wishesService.updateByOwner(
      Number(id),
      updateWishDto,
      req.user,
    );
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.wishesService.remove(Number(id), req.user.id);
  }
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(@Req() req, @Param('id') id: string) {
    const wish = await this.wishesService.findOne(Number(id));
    await this.wishesService.updateByCopied(wish.id);
    const newWish = new Wish();
    newWish.name = wish.name;
    newWish.link = wish.link;
    newWish.image = wish.image;
    newWish.price = wish.price;
    newWish.description = wish.description;
    return this.wishesService.create(newWish, req.user);
  }
}
