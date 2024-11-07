"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderRoutes_1 = __importDefault(require("../../modules/orders/routes/OrderRoutes"));
const routes_1 = __importDefault(require("../../modules/cars/routes/routes"));
const CustomerRoute_1 = __importDefault(require("../../modules/customers/routes/CustomerRoute"));
const UsersRoutes_1 = __importDefault(require("../../modules/users/routes/UsersRoutes"));
const verifyauth_1 = require("../middlewares/verifyauth");
const LoginRoutes_1 = __importDefault(require("../../modules/users/routes/LoginRoutes"));
const routes = (0, express_1.Router)();
routes.use('/login', LoginRoutes_1.default);
routes.use('/orders', verifyauth_1.authMiddleware, OrderRoutes_1.default);
routes.use('/cars', verifyauth_1.authMiddleware, routes_1.default);
routes.use('/customers', verifyauth_1.authMiddleware, CustomerRoute_1.default);
routes.use('/users', verifyauth_1.authMiddleware, UsersRoutes_1.default);
exports.default = routes;
