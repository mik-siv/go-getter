import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserModule } from './user/user.module';
import { userSwaggerConfig } from './swagger/config/user.swagger-config';
import { authSwaggerConfig } from './swagger/config/auth.swagger-config';
import { AuthModule } from './auth/auth.module';
import { goalSwaggerConfig } from './swagger/config/goal.swagger-config';
import { GoalModule } from './goal/goal.module';
import { setupSwaggerForModule } from './swagger/swagger.utils';
import helmet from 'helmet';
import { SubgoalModule } from './subgoal/subgoal.module';
import { subgoalSwaggerConfig } from './swagger/config/subgoal.swagger-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log'],
    cors: {
      origin: 'http://localhost:4200',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
  });
  //Setting route prefix
  app.setGlobalPrefix('api');
  //Swagger setup
  setupSwaggerForModule('api/auth/document', app, authSwaggerConfig, {
    include: [AuthModule],
  });
  setupSwaggerForModule('api/goals/document', app, goalSwaggerConfig, {
    include: [GoalModule],
  });
  setupSwaggerForModule('api/users/document', app, userSwaggerConfig, {
    include: [UserModule],
  });
  setupSwaggerForModule('api/subgoals/document', app, subgoalSwaggerConfig, {
    include: [SubgoalModule],
  });

  app.use(helmet());
  await app.listen(3000);
}

bootstrap();
