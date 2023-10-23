import { Expose, Type } from "class-transformer";
import { UserPreviewDto } from "../../administration/user/dto/user.preview.dto";

export class NewsPreviewDto {
  @Expose()
  id: string;

  @Expose()
  text: string;

  @Expose()
  @Type(() => UserPreviewDto)
  author: UserPreviewDto;
}
