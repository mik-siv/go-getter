import { MigrationInterface, QueryRunner } from "typeorm";

export class New1690221515087 implements MigrationInterface {
    name = 'New1690221515087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_450a05c0c4de5b75ac8d34835b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_450a05c0c4de5b75ac8d34835b9"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_450a05c0c4de5b75ac8d34835b9" UNIQUE ("password")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_450a05c0c4de5b75ac8d34835b" ON "users" ("password") `);
    }

}
