import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export function JwtModuleOptionsFactory(configService: ConfigService): JwtModuleOptions {
    return {
        secretOrPrivateKey: configService.get<string>('JWTSECRET'),
        signOptions: { expiresIn: '15s' },
    };
}
