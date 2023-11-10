import { DataSource, DataSourceOptions } from 'typeorm';

const getDBConfig = (env: string): DataSourceOptions => {
  switch (env) {
    case 'development':
      return {
        type: 'postgres',
        host: process.env.PGHOST,
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        port: Number(process.env.PGPORT),
        database: process.env.PGDATABASE,
        entities: [__dirname + '/../../**/*.entity.{js,ts}'],
        migrations: ['dist/db/migrations/*.{ts,js}'],
        migrationsRun: true,
        ssl: {
          rejectUnauthorized: false,
        },
        logging: ['query', 'info'],
      };
    case 'test':
      return {
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        url: process.env.DATABASE_URL,
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        migrations: ['dist/db/migrations/*.js'],
        migrationsRun: true,
        logging: ['query', 'info'],
      };
    case 'production':
      return {
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        url: process.env.DATABASE_URL,
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        migrations: ['dist/db/migrations/*.js'],
        migrationsRun: true,
        logging: ['query', 'info'],
      };
    default:
      throw new Error('unknown environment');
  }
};

export const dataSourceOptions: DataSourceOptions = getDBConfig(
  process.env.NODE_ENV,
);

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;