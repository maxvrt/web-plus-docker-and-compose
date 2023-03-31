import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entity/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });
    return { ...user, password: undefined };
  }
  async findByName(username: string, isValidation: boolean) {
    if (isValidation)
      return await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.username = :username', { username })
        .getOne();
    else {
      const user = await this.userRepository.findOne({ where: { username } });
      return { ...user, email: undefined };
    }
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = hashSync(createUserDto.password, 10);
    // замена пароля в объекте пользователя
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = createUserDto;
    const newObj = { ...rest, password: hashedPassword };
    let user = await this.userRepository.create(newObj);
    user = await this.userRepository.save(user);
    return { ...user, password: undefined };
  }
  async updateById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    if (updateUserDto.password) {
      updateUserDto.password = hashSync(updateUserDto.password, 10);
    }
    return this.userRepository.update({ id: id }, updateUserDto);
  }
  async findNameEmail(searchString: FindUserDto): Promise<User[]> {
    const findValue = searchString.query;
    if (findValue.includes('@')) {
      return await this.userRepository.find({
        where: { email: findValue },
      });
    } else {
      return await this.userRepository.find({
        where: { username: findValue },
      });
    }
  }
}
