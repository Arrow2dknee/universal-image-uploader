import { ImageMetadataInterface } from './imageMetadata.interface';

export interface UserInfoInterface {
  id: string;
  name: string;
  email: string;
  profilePhoto?: ImageMetadataInterface;
  updatedAt: Date;
}