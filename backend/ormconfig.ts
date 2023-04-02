import { DataSource } from 'typeorm';
export const appDataSource = new DataSource({
  type: 'postgres',
  host: 'pg',
  port: 5432,
  username: 'postgres',
  password: 'secretpassword',
  database: 'kupipodariday',
  entities: ['src/entity/*.{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
