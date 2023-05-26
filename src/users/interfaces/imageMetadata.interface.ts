export interface ImageMetadataInterface {
  fileName: string; // => originalname
  mimeType: string; // => mimetype
  data: Buffer; // => buffer
  size: number; // => size
}