/**
 * A temporary data store to keep all unassociated image metadatas
 */
import { IImageDataStore } from '../interfaces/imageDataStore.interface';

// associate each record with an entity enum
// after an image gets associated with an entity id, then remove the record

export const ImageStore: IImageDataStore[] = [];