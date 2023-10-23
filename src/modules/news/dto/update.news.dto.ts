import { IsUUID } from "class-validator";
import { CreateNewsDto } from "./create.news.dto";

export class UpdateNewsDto extends CreateNewsDto {
  @IsUUID('4')
  id: string;
}
