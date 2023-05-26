import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UploadController } from './upload/upload.controller';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [UsersModule, UploadModule],
  controllers: [AppController, UsersController, UploadController],
  providers: [AppService],
})
export class AppModule {}
