export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  profilePhoto: {
    fileName: string;
    mimeType: string;
  };
  updatedAt: Date;
}