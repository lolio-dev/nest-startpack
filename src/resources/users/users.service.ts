import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { FilesService } from "../files/files.service";
import { FileSourcesEnum } from "../../enums/FileSources.enum";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
  ) {
  }

  createUser(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      ...createUserDto,
      avatar: createUserDto.avatar ? { id: createUserDto.avatar } : null,
    });

    return this.userRepository.save(user);
  }

  async formatUser(userId: string): Promise<UserDto> {
    const user = await this.findUser(userId);
    let avatarUrl: string;

    if (user.avatar) {
      if (user.avatar.source === FileSourcesEnum.S3) {
        avatarUrl = await this.filesService.getFileUrl(user.avatar.id, userId);
      } else {
        avatarUrl = user.avatar.uri
      }
    } else {
      avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: avatarUrl,
    }
  }

  async findUser(userId: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id: userId }, relations: ['avatar'] })
  }

  findUserByEmail(userEmail: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ email: userEmail })
  }

  findUsers() {
    return this.userRepository.find();
  }

  async patchUser(userId: string, patchUserDto: Partial<PatchUserDto>) {
    const user = await this.userRepository.findOneBy({ id: userId });

    Object.assign(user, {
      ...patchUserDto,
      avatar: { id: patchUserDto.avatar }
    });

    return this.userRepository.save(user);
  }
}
