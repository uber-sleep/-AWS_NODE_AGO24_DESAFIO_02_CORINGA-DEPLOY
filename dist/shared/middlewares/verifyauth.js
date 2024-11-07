"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const AppError_1 = __importDefault(require("../errors/AppError"));
const auth_1 = __importDefault(require("../../config/auth"));
const authMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new AppError_1.default('jwt token is missing', 401);
    }
    const token = authorization.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, auth_1.default.jwt.secret);
        req.user = {
            email: decoded.email,
        };
        return next();
    }
    catch (_a) {
        throw new AppError_1.default('invalid JWT token', 401);
    }
};
exports.authMiddleware = authMiddleware;
