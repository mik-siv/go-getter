import { MigrationInterface, QueryRunner } from "typeorm";

export class New1704563720813 implements MigrationInterface {
    name = 'New1704563720813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goals" ADD "private" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goals" DROP COLUMN "private"`);
    }

}
