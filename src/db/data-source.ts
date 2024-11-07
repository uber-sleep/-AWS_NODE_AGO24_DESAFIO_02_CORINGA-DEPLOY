import 'reflect-metadata';

import { DataSource } from 'typeorm';
import Customer from '../modules/customers/entities/Customer';
import User from '../modules/users/entities/User';
import Order from '../modules/orders/entities/OrderEntity';
import Cars from '../modules/cars/entities/Cars';

import dotenv from 'dotenv';
dotenv.config();

const port = parseInt(process.env.DB_PORT as string, 10) || 3306;

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [Customer, User, Order, Cars],
  migrations: ['src/db/migration/*.ts'],
  subscribers: [],
});

export default AppDataSource;
