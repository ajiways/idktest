import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NewsEntity } from "./news.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { ListQueryDto } from "./dto/list-query.dto";
import { UserPayload } from "../../common/types";
import { CreateNewsDto } from "./dto/create.news.dto";
import { UpdateNewsDto } from "./dto/update.news.dto";
import { UserService } from "../administration/user/user.service";
import { NewsListDto } from "./dto/news-list.dto";
import { plainToInstance } from "class-transformer";
import { NewsPreviewDto } from "./dto/news.preview.dto";

@Injectable()
export class NewsService {
  @InjectRepository(NewsEntity)
  private readonly newsRepository: Repository<NewsEntity>;

  @Inject(UserService)
  private readonly userService: UserService;

  async create(dto: CreateNewsDto, payload: UserPayload): Promise<NewsPreviewDto> {
    const user = await this.userService.findOneBy({ id: payload.id });

    const news = await this.newsRepository.save({ ...dto, author: user });

    return this.makePreview(news);
  }

  async getOne(id: string): Promise<NewsPreviewDto> {
    const candidate = await this.newsRepository.findOne({
      where: { id },
      relations: { author: true }
    });

    if (!candidate) {
      throw new NotFoundException(`News with id ${id} was not found`);
    }

    return this.makePreview(candidate);
  }

  async getList(dto: ListQueryDto, payload?: UserPayload): Promise<NewsListDto> {
    const condition: FindOptionsWhere<NewsEntity> = {};

    if (payload) {
      condition.author = { id: payload.id }
    }

    const [news, count] = await this.newsRepository.findAndCount({
      where: condition,
      skip: (dto.page - 1) * dto.count,
      take: dto.count,
      relations: { author: true }
    });

    return plainToInstance(
      NewsListDto,
      { news, count, pages: Math.ceil(count / dto.count) },
      { excludeExtraneousValues: true }
    );
  }

  async update(dto: UpdateNewsDto, payload: UserPayload): Promise<NewsPreviewDto> {
    const candidate = await this.newsRepository.findOne({
      where: { id: dto.id, author: { id: payload.id } },
      relations: { author: true }
    });

    if (!candidate) {
      throw new NotFoundException(`News with id ${dto.id} was not found`)
    }

    const news = await this.newsRepository.save(dto);

    return this.makePreview(news);
  }

  async delete(id: string, payload: UserPayload): Promise<NewsPreviewDto> {
    const candidate = await this.newsRepository.findOne({
      where: { id, author: { id: payload.id } },
      relations: { author: true }
    });

    if (!candidate) {
      throw new NotFoundException(`News with id ${id} was not found`);
    }

    await this.newsRepository.delete(candidate);

    return this.makePreview(candidate);
  }

  private makePreview(news: NewsEntity): NewsPreviewDto;
  private makePreview(news: NewsEntity[]): NewsPreviewDto[];
  private makePreview(news: NewsEntity[] | NewsEntity): NewsPreviewDto[] | NewsPreviewDto {
    return plainToInstance(NewsPreviewDto, news, { excludeExtraneousValues: true });
  }
}
