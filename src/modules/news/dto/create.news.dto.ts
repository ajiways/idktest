import { IsString } from "class-validator";

export class CreateNewsDto {
  @IsString()
  text: string;
}
