import { Controller, Post, Get, Put, Delete, Body, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { CreateUserDto, UserIdDto } from './dto';
import { UsersService } from './users.service';
import { IUserProfile } from './interfaces';

@Controller('users')
export class UsersController {
	constructor(
		private readonly userService: UsersService,
	) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	createUser(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateUserDto) {
		const user = this.userService.addUser(dto, file);

		return {
			message: 'User added successfully',
			data: user,
		}
	}

	@Put('/:id')
	@UseInterceptors(FileInterceptor('file'))
	updateUser(@UploadedFile() file: Express.Multer.File, @Param() { id }: UserIdDto) {
		if (!file) {
			throw new BadRequestException('Upload an image to update user');
		}
		const data: IUserProfile = this.userService.updateUserInfo(id, {
			fileName: file.originalname,
			mimeType: file.mimetype,
			data: file.buffer,
			size: file.size,
		});

		return {
			message: 'User updated successfully',
			data,
		};
	}

	@Get()
	getUsers() {
		const data = this.userService.getAllUsers();

    return {
      message: 'Users fetched successfully',
      data,
    }
	}

	@Delete('/:id')
	removeUser(@Param() { id }: UserIdDto) {
		this.userService.deleteUser(id);

    return {
      message: `User with id=${id} has been removed`,
      data: null,
    };
	}

	
}
