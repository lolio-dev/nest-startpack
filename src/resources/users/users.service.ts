import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/path-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    return this.userRepository.save(user);
  }

  findUser(userId: string) {
    return this.userRepository.findOneBy({ id: userId });
  }

  findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findUsers() {
    return this.userRepository.find();
  }

  patchUser(userId: string, patchUserDto: PatchUserDto) {
    return this.userRepository.update(userId, patchUserDto);
  }
}
