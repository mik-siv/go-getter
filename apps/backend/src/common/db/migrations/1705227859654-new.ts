import { MigrationInterface, QueryRunner } from 'typeorm';

export class New1705227859654 implements MigrationInterface {
  name = 'New1705227859654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "subgoals" ("id" uuid NOT NULL, "name" character varying(255), "private" boolean NOT NULL DEFAULT true, "metadata" json NOT NULL DEFAULT '{}', "created_by" uuid, "parentId" uuid, CONSTRAINT "PK_5ab6b0b3efb24b88c3498d98a05" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "goal_subgoals" ("subgoal_id" uuid NOT NULL, "goal_id" uuid NOT NULL, CONSTRAINT "PK_29aadefee0db36221503f6c8ebf" PRIMARY KEY ("subgoal_id", "goal_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_090b9cde234346fc3756ef8989" ON "goal_subgoals" ("subgoal_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_a3e407d92e541ff7d625991304" ON "goal_subgoals" ("goal_id") `);
    await queryRunner.query(
      `ALTER TABLE "subgoals" ADD CONSTRAINT "FK_a5377f819853faca106d280478f" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subgoals" ADD CONSTRAINT "FK_72945c21bd0d56fa96913d6640b" FOREIGN KEY ("parentId") REFERENCES "subgoals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal_subgoals" ADD CONSTRAINT "FK_090b9cde234346fc3756ef8989f" FOREIGN KEY ("subgoal_id") REFERENCES "subgoals"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal_subgoals" ADD CONSTRAINT "FK_a3e407d92e541ff7d625991304a" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "goal_subgoals" DROP CONSTRAINT "FK_a3e407d92e541ff7d625991304a"`);
    await queryRunner.query(`ALTER TABLE "goal_subgoals" DROP CONSTRAINT "FK_090b9cde234346fc3756ef8989f"`);
    await queryRunner.query(`ALTER TABLE "subgoals" DROP CONSTRAINT "FK_72945c21bd0d56fa96913d6640b"`);
    await queryRunner.query(`ALTER TABLE "subgoals" DROP CONSTRAINT "FK_a5377f819853faca106d280478f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a3e407d92e541ff7d625991304"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_090b9cde234346fc3756ef8989"`);
    await queryRunner.query(`DROP TABLE "goal_subgoals"`);
    await queryRunner.query(`DROP TABLE "subgoals"`);
  }
}
