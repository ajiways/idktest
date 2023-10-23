import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query } from "@nestjs/common";
import { NewsService } from "./news.service";
import { ListQueryDto } from "./dto/list-query.dto";
import { Public } from "../../common/decorators/is-public.decorator";
import { GetUser } from "../../common/decorators/get-user";
import { CreateNewsDto } from "./dto/create.news.dto";
import { UserPayload } from "../../common/types";
import { UpdateNewsDto } from "./dto/update.news.dto";

@Controller('/news')
export class NewsController {
  @Inject(NewsService)
  private readonly newsService: NewsService;

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getList(@Query() arg: ListQueryDto) {
    return this.newsService.getList(arg);
  }

  @Get('/my')
  @HttpCode(HttpStatus.OK)
  async getMyList(@Query() arg: ListQueryDto, @GetUser() payload: UserPayload) {
    return this.newsService.getList(arg, payload);
  }

  @Public()
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string) {
    return this.newsService.getOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() arg: CreateNewsDto, @GetUser() payload: UserPayload) {
    return this.newsService.create(arg, payload);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Body() arg: UpdateNewsDto, @GetUser() payload: UserPayload) {
    return this.newsService.update(arg, payload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string, @GetUser() payload: UserPayload) {
    return this.newsService.delete(id, payload);
  }
}
