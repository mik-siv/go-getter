import { MigrationInterface, QueryRunner } from "typeorm";

export class New1703948703700 implements MigrationInterface {
    name = 'New1703948703700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "goals" ("id" uuid NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "subgoals" json NOT NULL DEFAULT '[]', "metadata" json NOT NULL DEFAULT '[]', "created_by" uuid, "parentId" uuid, CONSTRAINT "PK_26e17b251afab35580dff769223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "goal_contributors" ("goal_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_6109a2d9370ca1be4c19f9c656b" PRIMARY KEY ("goal_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d70611de3b434244a95a326e57" ON "goal_contributors" ("goal_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_04a889031f285cf8ab4e0675e7" ON "goal_contributors" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "goals" ADD CONSTRAINT "FK_b2a8c58bb96b42df218689f762c" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "goals" ADD CONSTRAINT "FK_3ace23ef9179a434892c9586d6e" FOREIGN KEY ("parentId") REFERENCES "goals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "goal_contributors" ADD CONSTRAINT "FK_d70611de3b434244a95a326e570" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "goal_contributors" ADD CONSTRAINT "FK_04a889031f285cf8ab4e0675e7e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal_contributors" DROP CONSTRAINT "FK_04a889031f285cf8ab4e0675e7e"`);
        await queryRunner.query(`ALTER TABLE "goal_contributors" DROP CONSTRAINT "FK_d70611de3b434244a95a326e570"`);
        await queryRunner.query(`ALTER TABLE "goals" DROP CONSTRAINT "FK_3ace23ef9179a434892c9586d6e"`);
        await queryRunner.query(`ALTER TABLE "goals" DROP CONSTRAINT "FK_b2a8c58bb96b42df218689f762c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_04a889031f285cf8ab4e0675e7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d70611de3b434244a95a326e57"`);
        await queryRunner.query(`DROP TABLE "goal_contributors"`);
        await queryRunner.query(`DROP TABLE "goals"`);
    }

}
