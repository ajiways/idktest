import { Expose } from "class-transformer";

export class UserPreviewDto {
  @Expose()
  id: string;

  @Expose()
  email: string;
}
