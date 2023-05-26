import { Module, forwardRef } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [forwardRef(() => UploadModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
