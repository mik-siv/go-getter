import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [ConfigModule],
  controllers: [FileController],
  providers: [FileService, ConfigService],
  exports: [FileService],
})
export class FileModule {}
