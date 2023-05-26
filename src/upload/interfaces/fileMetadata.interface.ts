/**
 * Sample file output
 * {
  fieldname: 'file',
  originalname: 'unsplash-image.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff e2 0c 58 49 43 43 5f 50 52 4f 46 49 4c 45 00 01 01 00 00 0c 48 4c 69 6e 6f 02 10 00 00 ... 520818 more bytes>,
  size: 520868
}
 */

export interface FileMetadataInterface {
  fieldName: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}