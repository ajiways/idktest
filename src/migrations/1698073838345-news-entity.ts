import { MigrationInterface, QueryRunner } from "typeorm";

export class NewsEntity1698073838345 implements MigrationInterface {
    name = 'NewsEntity1698073838345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "news" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "author_id" uuid, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "news" ADD CONSTRAINT "FK_18ab67e7662dbc5d45dc53a6e00" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_18ab67e7662dbc5d45dc53a6e00"`);
        await queryRunner.query(`DROP TABLE "news"`);
    }

}
