"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Customer_1 = __importDefault(require("../modules/customers/entities/Customer"));
const User_1 = __importDefault(require("../modules/users/entities/User"));
const OrderEntity_1 = __importDefault(require("../modules/orders/entities/OrderEntity"));
const Cars_1 = __importDefault(require("../modules/cars/entities/Cars"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = parseInt(process.env.DB_PORT, 10) || 3306;
const AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: port,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [Customer_1.default, User_1.default, OrderEntity_1.default, Cars_1.default],
    migrations: ['src/db/migration/*.ts'],
    subscribers: [],
});
exports.default = AppDataSource;
