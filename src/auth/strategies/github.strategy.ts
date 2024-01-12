import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>('AUTH_REDIRECT_URL')}/auth/github/redirect`,
      scope: ['public_profile']
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const data = profile._json as Record<string, string>

    return {
      username: data.name,
      email: data.email,
      avatar: data.avatar_url,
      accessToken
    }
  }
}