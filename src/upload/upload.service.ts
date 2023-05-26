import { BadRequestException, Injectable, forwardRef, Inject } from '@nestjs/common';
import { uuid } from 'uuidv4';

import { EntityEnum } from './enums/entity.enum';
import { Users } from '../users/store/users';
import { ImageMetadataInterface, UserInfoInterface } from '../users/interfaces';
import { UsersService } from '../users/users.service';
import { ImageStore } from './store/imageDump';
import { IImageInfo } from './interfaces';

@Injectable()
export class UploadService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  public removeImageAfterAssociation(id: string): void {
    const pos = ImageStore.findIndex((image) => image.id === id);

    if (pos !== -1) {
      ImageStore.splice(pos, 1);
    }
  }

  /**
   *  Note:
   *  Making few assumptions here
      Each entity should have it's own data stores
   */
  universalImageUploader(file: Express.Multer.File, entity: EntityEnum, entityId: string): string {
    if (!file) {
      throw new BadRequestException('Upload an image to continue');
    }

    const uploadedImage: ImageMetadataInterface = {
      fileName: file.originalname,
      mimeType: file.mimetype,
      data: file.buffer,
      size: file.size,
    };
    const newImageId = uuid(); // Use this image id for association later on

    if (entityId && entityId !== ':entityId') {
      switch(entity) {
        case EntityEnum.User:
          // find entity & associate image with entity id
          this.userService.validateUser(entityId);
          this.userService.updateUserInfo(entityId, uploadedImage);
          break;
        default:
          throw new BadRequestException('Unknown entity');
      }
    } else {
      // To be associated later on
      ImageStore.push({
        id: newImageId,
        entity,
        image: uploadedImage,
        updatedAt: new Date(),
      });
    }

    return newImageId;
  }

  removeUnassociatedImagesFromStore(): void {
    ImageStore.splice(0, ImageStore.length);
  }

  listImagesInStore(): IImageInfo[] {
    const images = ImageStore.map((img) => {
      return {
        id: img.id,
        entity: img.entity,
        metadata: {
          fileName: img.image.fileName,
          mimeType: img.image.mimeType
        },
        updatedAt: img.updatedAt,
      };
    })

    return images.sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf());
  }
}
