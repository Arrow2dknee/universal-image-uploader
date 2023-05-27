import { Controller, Post, Param, UseInterceptors, UploadedFile, Delete, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { UploadService } from './upload.service';
import { EntityIdDto, EntityDto } from './dto';
import { IApiResponse } from '../common/interfaces/response.interface';
import { imageFileFilter } from '../common/filters/imageFile.filter';
import { IImageInfo } from './interfaces';
import { SUCCESS } from '../common/messages/success.messages';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
  ) {}

  @Post('/:entity/:entityId')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 10240000, // Setting max allowed file size of 10 MB
    }
  }))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Param() { entity }: EntityDto, @Param() { entityId }: EntityIdDto): IApiResponse {
    const data = this.uploadService.universalImageUploader(file, entity, entityId);

    return {
      message: SUCCESS.IMAGE_UPLOAD.UPLOADED,
      data,
    };
  }

  @Get()
  listAllUploadedImages(): IApiResponse {
    const data: IImageInfo[] = this.uploadService.listImagesInStore();

    return {
      message: SUCCESS.IMAGE_UPLOAD.UNLINKED_LIST,
      data,
    }
  }

  @Delete('/all')
  cleanUp(): IApiResponse {
    this.uploadService.removeUnassociatedImagesFromStore();

    return {
      message: SUCCESS.IMAGE_UPLOAD.UNLINKED_REMOVED,
      data: null,
    }
  }
}
