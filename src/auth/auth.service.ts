import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../resources/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
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
      ...registerDto,
      password: hashedPassword,
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
}
