import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
config();

export default new DataSource({
  type: 'postgres',
  port: process.env.DB_PORT as unknown as number,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  logging: false,
  autoLoadEntities: true,
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: ["dist/migrations/*{.ts,.js}"]
} as DataSourceOptions)
