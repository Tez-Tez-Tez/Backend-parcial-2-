import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import {ExtractJwt, Strategy} from 'passport-jwt'
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private config : ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('config.jwt') || 'fallback'
        });
    }
    async validate(payload: any){
       return {id: payload.id,
        rol: payload.rol}
    }
}