import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/entity/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'secretpassword',
  database: 'kupipodariday',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
