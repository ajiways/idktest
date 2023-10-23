import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";
import { notEmpty } from "../../../common/utils";

export class ListQueryDto {
  @Transform(({ obj }) => notEmpty(obj.count) ? Number(obj.count) : null)
  @IsNumber()
  count: number;

  @Transform(({ obj }) => notEmpty(obj.page) ? Number(obj.page) : null)
  @IsNumber()
  page: number;
}
