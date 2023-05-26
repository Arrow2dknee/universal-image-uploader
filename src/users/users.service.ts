import { Injectable, BadRequestException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { uuid } from 'uuidv4';

import { CreateUserDto } from './dto';
import { Users } from './store/users';
import { IUserProfile, ImageMetadataInterface, UserInfoInterface } from './interfaces';
import { UploadService } from '../upload/upload.service';
import { EntityEnum } from '../upload/enums/entity.enum';
import { ImageStore } from '../upload/store/imageDump';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => UploadService))
    private readonly uploadService: UploadService,
  ) {}

  private getUserDetails(id: string) {
    const user = Users.find((user) => user.id === id);
    const userObj = {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePhoto: null,
      updatedAt: user.updatedAt,
    };
    if (user.profilePhoto) {
      const { fileName, mimeType } = user.profilePhoto;
      return {
        ...userObj,
        profilePhoto: {
          fileName,
          mimeType,
        },
      }
    }

    return userObj;
  }

  private findUserAndUpdateImage(userId: string, imageDto: ImageMetadataInterface) {
    Users.map((user: UserInfoInterface) => {
      if (user.id === userId) {
        user.updatedAt = new Date(),
        user.profilePhoto = {
          ...imageDto,
        };
      }
    });
  }

  validateUser(id: string) {
    const user = Users.find((user: UserInfoInterface) => user.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  addUser(dto: CreateUserDto, file: Express.Multer.File): IUserProfile {
    const { name, email, imageId } = dto;
    let doesNameExists = null;
    let doesEmailExists = null;
    // validate if name and email already exists
    if (name) {
      doesNameExists = Users.find((user: UserInfoInterface) => user.name.toLowerCase() === name.toLowerCase());

      if (doesNameExists) {
        throw new BadRequestException('Name already exists');
      }
    }

    if (email) {
      doesEmailExists = Users.find((user: UserInfoInterface) => user.email.toLowerCase() === email.toLowerCase());

      if (doesEmailExists) {
        throw new BadRequestException('Email already exists');
      }
    }

    let unassignedImage = null;
    if (imageId) {
      unassignedImage = ImageStore.find((image) => image.id === imageId);
      if (!unassignedImage) {
        throw new BadRequestException('Invalid image provided for association');
      }
    }

    // push user to users array
    const response = {
      id: uuid(),
      name,
      email,
      profilePhoto: null,
      updatedAt: new Date(),
    };
    Users.push(response);
    // profile photo is optional
    /**
     * if imageId is provided, then associate image with user's profile photo
     * if not, check if image is uploaded, then set user's profile photo
     */
    if (imageId) {
      this.findUserAndUpdateImage(response.id, unassignedImage.image);
      // remove entry after successful association
      this.uploadService.removeImageAfterAssociation(unassignedImage.id);
    } else if (file) {
      this.uploadService.universalImageUploader(file, EntityEnum.User, response.id);
    }
     
    return this.getUserDetails(response.id);
  }

  updateUserInfo(userId: string, imageDto: ImageMetadataInterface) {
    // validate user id
    this.validateUser(userId);
    // only image can be updated
    this.findUserAndUpdateImage(userId, imageDto);

    return this.getUserDetails(userId);
  } 

  getAllUsers() {
    const users = Users.map((user) => this.getUserDetails(user.id));

    return users.sort((a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf());
  }

  deleteUser(id: string) {
    // validate user id
    this.validateUser(id);
    // remove user from array
    const pos = Users.findIndex((user) => user.id === id);

    if (pos !== -1) {
      Users.splice(pos, 1);
    }
  }
}
