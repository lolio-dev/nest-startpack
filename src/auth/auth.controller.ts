import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserEntity } from '../resources/users/entities/user.entity';
import { AuthGuard } from "@nestjs/passport";
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthProviders } from "../enums/AuthProviders.enum";
import { OauthDto } from "./dto/oauth.dto";
import { UsersService } from "../resources/users/users.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
  }

  @Get('/@me')
  @UseGuards(JwtAuthGuard)
  getProfile(@User() user: UserEntity) {
    return this.usersService.formatUser(user.id);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@User() user: UserEntity) {
    return this.authService.login(user);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return true
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    return true
  }

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @User() user: OauthDto,
    @Res() res: Response
  ) {
    await this.authService.oauthLogin(user, AuthProviders.Google)
      .then((access_token: string) => res.redirect(`${this.configService.get<string>('CLIENT_URL')}/login?access_token=${access_token}`))
      .catch(() => res.redirect(`${this.configService.get<string>('CLIENT_URL')}/login?error=Email déjà utilisé`))
  }

  @Get('/github/redirect')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(
    @User() user: OauthDto,
    @Res() res: Response
  ) {
    await this.authService.oauthLogin(user, AuthProviders.Github)
      .then((access_token: string) => res.redirect(`${this.configService.get<string>('CLIENT_URL')}/login?access_token=${access_token}`))
      .catch(() => res.redirect(`${this.configService.get<string>('CLIENT_URL')}/login?error=Email déjà utilisé`))
  }
}
