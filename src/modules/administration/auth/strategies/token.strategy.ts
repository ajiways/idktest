import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserPayload } from "../../../../common/types/interfaces";
import { ConfigurationService } from "../../../config/configuration.service";
import { Inject } from "@nestjs/common";

export class TokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(ConfigurationService) config: ConfigurationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.env.JWT_SECRET,
    })
  }

  validate(payload: UserPayload) {
    return payload;
  }
}
