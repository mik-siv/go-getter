import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { authTokenExpiration } from '../common/constants'

export function JwtModuleOptionsFactory(configService: ConfigService): JwtModuleOptions {
    return {
        secret: configService.get<string>('JWTSECRET'),
        signOptions: { expiresIn: authTokenExpiration },
    };
}
