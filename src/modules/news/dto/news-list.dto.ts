import { Expose, Type } from "class-transformer";
import { NewsPreviewDto } from "./news.preview.dto";

export class NewsListDto {
  @Expose()
  @Type(() => NewsPreviewDto)
  news: NewsPreviewDto[];

  @Expose()
  count: number;

  @Expose()
  pages: number;
}
