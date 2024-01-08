import { MigrationInterface, QueryRunner } from "typeorm";

export class New1704388348864 implements MigrationInterface {
    name = 'New1704388348864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goals" ALTER COLUMN "metadata" SET DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goals" ALTER COLUMN "metadata" SET DEFAULT '[]'`);
    }

}
