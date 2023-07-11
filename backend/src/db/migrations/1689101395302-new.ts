import { MigrationInterface, QueryRunner } from "typeorm";

export class new1689101395302 implements MigrationInterface {
    name = 'new1689101395302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_date" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_date" SET DEFAULT '2023-07-10 19:04:05.599'`);
    }

}
