import { MigrationInterface, QueryRunner } from "typeorm";

export class New1704315782118 implements MigrationInterface {
    name = 'New1704315782118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goals" ADD "name" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goals" DROP COLUMN "name"`);
    }

}
