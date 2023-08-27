import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GoalsModule } from './goals/goals.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { dataSourceOptions } from './db/data-source';
import * as Joi from 'joi'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
      validationSchema: Joi.object({
        PGHOST: Joi.string().required(),
        PGDATABASE: Joi.string().required(),
        PGUSER: Joi.string().required(),
        PGPASSWORD: Joi.string().required(),
        PGPORT: Joi.string().required(),
        JWTSECRET: Joi.string().required()
      }).required()
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    GoalsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
