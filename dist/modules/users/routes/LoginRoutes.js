"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const LoginController_1 = __importDefault(require("../controllers/LoginController"));
const LoginService_1 = __importDefault(require("../services/LoginService"));
const loginRouter = (0, express_1.Router)();
const loginService = new LoginService_1.default();
const loginController = new LoginController_1.default(loginService);
loginRouter.post('/', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: {
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().required(),
    },
}), (req, res) => loginController.login(req, res));
exports.default = loginRouter;
