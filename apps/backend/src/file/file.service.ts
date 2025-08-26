import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as toStream from 'buffer-to-stream';
import { v2 as cloudinary } from 'cloudinary';
import { UpdateFileDto } from './dto/update-file.dto';
import { CloudinaryConfig } from './types/cloudinary.types';

@Injectable()
export class FileService {
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
    setTimeout(() => cloudinary.config(this.getCloudinaryConfig()), 0);
  }

  async deleteFile(publicId: string): Promise<any> {
    return await cloudinary.uploader.destroy(publicId);
  }

  create(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
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
}
