import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { CloudinaryConfig } from './types/cloudinary.types';

@Injectable()
export class FileService {
  private readonly cloudinaryInstance: typeof cloudinary;

  constructor(private readonly configService: ConfigService) {
    this.setupCloudinary().then();
  }

  private getCloudinaryConfig(): CloudinaryConfig {
    return {
      cloud_name: this.configService.get<string>('CLOUDINARY_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    };
  }

  private async setupCloudinary(): Promise<void> {
    setTimeout(() => this.cloudinaryInstance.config(this.getCloudinaryConfig()), 0);
  }

  async deleteFile(publicId: string): Promise<any> {
    return this.cloudinaryInstance.uploader.destroy(publicId);
  }

  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
