import { MigrationInterface, QueryRunner } from 'typeorm';

export class New1706818749154 implements MigrationInterface {
  name = 'New1706818749154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "goal_contributors" DROP CONSTRAINT "FK_d70611de3b434244a95a326e570"`);
    await queryRunner.query(
      `ALTER TABLE "goal_contributors" ADD CONSTRAINT "FK_d70611de3b434244a95a326e570" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "goal_contributors" DROP CONSTRAINT "FK_d70611de3b434244a95a326e570"`);
    await queryRunner.query(
      `ALTER TABLE "goal_contributors" ADD CONSTRAINT "FK_d70611de3b434244a95a326e570" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
