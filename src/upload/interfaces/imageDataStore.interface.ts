import { ImageMetadataInterface } from "../../users/interfaces";
import { EntityEnum } from "../enums/entity.enum";

export interface IImageDataStore {
  id: string;
  entity: EntityEnum;
  image: ImageMetadataInterface;
  updatedAt: Date;
}