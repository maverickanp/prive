import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTables1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'drivers',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'vehicle',
            type: 'varchar',
          },
          {
            name: 'rating',
            type: 'int',
          },
          {
            name: 'price_per_km',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'min_km_required',
            type: 'int',
          },
        ],
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'rides',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'customer_id',
            type: 'varchar',
          },
          {
            name: 'driver_id',
            type: 'int',
          },
          {
            name: 'origin',
            type: 'varchar',
          },
          {
            name: 'destination',
            type: 'varchar',
          },
          {
            name: 'distance',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'duration',
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'origin_latitude',
            type: 'decimal',
            precision: 10,
            scale: 8,
          },
          {
            name: 'origin_longitude',
            type: 'decimal',
            precision: 11,
            scale: 8,
          },
          {
            name: 'destination_latitude',
            type: 'decimal',
            precision: 10,
            scale: 8,
          },
          {
            name: 'destination_longitude',
            type: 'decimal',
            precision: 11,
            scale: 8,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'rides',
      new TableForeignKey({
        columnNames: ['driver_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drivers',
        onDelete: 'RESTRICT',
      })
    );

    await queryRunner.query(`
      INSERT INTO drivers (id, name, description, vehicle, rating, price_per_km, min_km_required)
      VALUES 
        (1, 'Homer Simpson', 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).', 'Plymouth Valiant 1973 rosa e enferrujado', 2, 2.50, 1),
        (2, 'Dominic Toretto', 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.', 'Dodge Charger R/T 1970 modificado', 4, 5.00, 5),
        (3, 'James Bond', 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.', 'Aston Martin DB5 clássico', 5, 10.00, 10);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('rides');
    await queryRunner.dropTable('drivers');
  }
}