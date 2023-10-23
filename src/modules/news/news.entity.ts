import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../administration/user/user.entity";

@Entity('news')
export class NewsEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ name: 'text', type: 'text', nullable: false })
  text: string;

  @JoinColumn()
  readonly author_id: string;

  @ManyToOne(() => UserEntity, (user) => user.news, { onDelete: 'CASCADE' })
  author: UserEntity;
}
