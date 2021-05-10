import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterStatementAddSenderId1620671863372 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        'statements',
        new TableColumn({
          name: 'send_id',
          type: 'uuid',
          isNullable: true,
        }),
      );

      await queryRunner.createForeignKey(
        'statements',
        new TableForeignKey({
          name: 'fk_send',
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          columnNames: ['send_id'],
          onDelete: 'SET NULL',
          onUpdate: 'SET NULL',
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('statements', 'fk_send');

      await queryRunner.dropColumn('statements', 'send_id');
    }

}
