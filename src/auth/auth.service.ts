import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../resources/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { FilesService } from "../resources/files/files.service";
import { FileScopesEnum } from "../enums/FileScopes.enum";
import { FileSourcesEnum } from "../enums/FileSources.enum";
import { AuthProviders } from "../enums/AuthProviders.enum";
import { OauthDto } from "./dto/oauth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);

    if (user.authProvider !== AuthProviders.Local) {
      throw new UnauthorizedException()
    }

    const isPasswordMatching = await compare(password, user.password);

    if (user && isPasswordMatching) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new BadRequestException('Bad credentials');
    }
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await hash(registerDto.password, 10);

    const createdUser = await this.usersService.createUser({
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
      authProvider: AuthProviders.Local
    });

    createdUser.username = undefined;
    return createdUser;
  }

  async login(user) {
    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async oauthLogin(userData: OauthDto, authProvider: AuthProviders) {
    if (!userData) {
      throw new UnauthorizedException()
    }
    let user = await this.usersService.findUserByEmail(userData.email);

    if (!user) {
      user = await this.usersService.createUser({
        email: userData.email,
        username: userData.username,
        authProvider: authProvider
      });

      const file = await this.filesService.saveFile(userData.avatar, FileScopesEnum.UserAvatar, FileSourcesEnum.External, user.id);

      await this.usersService.patchUser(user.id, {
        avatar: file.id
      });
    } else {
      if (user.authProvider !== authProvider) {
        throw new UnauthorizedException()
      }
    }

    const payload = { sub: user.id }

    return this.jwtService.sign(payload, {
      expiresIn: 1440
    })
  }
}
