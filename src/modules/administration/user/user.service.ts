import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterDto } from "../auth/dto/register.dto";
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;

  async createUser(dto: RegisterDto): Promise<UserEntity> {
    const candidate = await this.userRepository.findOne({ where: { email: dto.email } });

    if (candidate) {
      throw new BadRequestException('User exists');
    }

    return await this.userRepository.save({
      ...dto,
      refreshToken: ''
    });
  }

  async updateUser(user: UserEntity): Promise<UserEntity> {
    const candidate = await this.userRepository.findOne({ where: { id: user.id } });

    if (!candidate) {
      throw new BadRequestException('User not exists');
    }

    return await this.userRepository.save(user);
  }

  async findOneBy(condition: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.findOneBy(condition);
  }
}
