import { EntityEnum } from "../enums/entity.enum";

export interface IImageInfo {
  id: string;
  entity: EntityEnum;
  metadata: {
    fileName: string;
    mimeType: string;
  };
  updatedAt: Date;
}