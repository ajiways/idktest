import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NewsEntity } from "../../news/news.entity";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'email', unique: true, type: 'varchar', nullable: false })
  email: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;

  @Column({ name: 'refresh_token', type: 'text', nullable: false })
  refreshToken: string;

  @OneToMany(() => NewsEntity, (news) => news.author)
  news: NewsEntity[];
}
