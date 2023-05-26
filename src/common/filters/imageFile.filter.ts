import { IMAGE_MIMETYPES } from '../constants/ImageMimeTypes';

export const imageFileFilter = (req, file: Express.Multer.File, callback) => {
  const isValidMimeType = IMAGE_MIMETYPES.includes(file.mimetype);

  if (!isValidMimeType) {
    callback(null, false);
  } else {
    callback(null, true);
  }
}