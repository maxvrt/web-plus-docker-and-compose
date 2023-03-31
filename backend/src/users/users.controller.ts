import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from './entity/User';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { WishesService } from '../wishes/wishes.service';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  @Get('me')
  async profile(@Req() req, @Res() res): Promise<User> {
    let user = req.user;
    user = await this.usersService.findOne(Number(user.id));
    const newUser = { ...user, password: undefined };
    res.json(newUser);
    return newUser;
  }
  @Get(':username')
  findUser(@Param('username') username: string) {
    return this.usersService.findByName(username, false);
  }
  @Get('me/wishes')
  async findMyWishes(@Req() req) {
    return this.wishesService.findWishesByMe(req.user.id);
  }
  @Get(':username/wishes')
  async findUserWishes(@Param('username') username: string) {
    const { id } = await this.usersService.findByName(username, false);
    return this.wishesService.findWishesByOwner(id);
  }
  @Patch('me')
  async updateById(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.updateById(req.user.id, updateUserDto);
    return this.usersService.findOne(req.user.id);
  }
  @Post('find')
  findByNameEmail(@Body() findUserDto: FindUserDto) {
    return this.usersService.findNameEmail(findUserDto);
  }
}
