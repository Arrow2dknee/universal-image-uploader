import { Controller, Post, Get, Put, Delete, Body, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { CreateUserDto, UserIdDto } from './dto';
import { UsersService } from './users.service';
import { IUserProfile } from './interfaces';
import { imageFileFilter } from '../common/filters/imageFile.filter';
import { SUCCESS } from '../common/messages/success.messages';
import { ERROR } from '../common/messages/error.messages';
import { IApiResponse } from '../common/interfaces/response.interface';

@Controller('users')
export class UsersController {
	constructor(
		private readonly userService: UsersService,
	) {}

	@Post()
	@UseInterceptors(FileInterceptor('file', {
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 10240000, // Setting max allowed file size of 10 MB
    }
  }))
	createUser(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateUserDto): IApiResponse {
		const user = this.userService.addUser(dto, file);

		return {
			message: SUCCESS.USER.CREATED,
			data: user,
		}
	}

	@Put('/:id')
	@UseInterceptors(FileInterceptor('file', {
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 10240000, // Setting max allowed file size of 10 MB
    }
  }))
	updateUser(@UploadedFile() file: Express.Multer.File, @Param() { id }: UserIdDto): IApiResponse {
		if (!file) {
			throw new BadRequestException(ERROR.UPLOAD.REQUIRED);
		}
		const data: IUserProfile = this.userService.updateUserInfo(id, {
			fileName: file.originalname,
			mimeType: file.mimetype,
			data: file.buffer,
			size: file.size,
		});

		return {
			message: SUCCESS.USER.UPDATED,
			data,
		};
	}

	@Get()
	getUsers(): IApiResponse {
		const data = this.userService.getAllUsers();

    return {
      message: SUCCESS.USER.LIST,
      data,
    }
	}

	@Delete('/:id')
	removeUser(@Param() { id }: UserIdDto): IApiResponse {
		this.userService.deleteUser(id);

    return {
      message: `User with id=${id} has been removed`,
      data: null,
    };
	}
}
