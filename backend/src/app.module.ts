import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { dataSourceOptions } from './db/data-source';
import { GoalModule } from './goal/goal.module';
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
    AuthModule,
    GoalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
