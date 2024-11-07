"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../../shared/errors/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../../../config/auth"));
class LoginService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            if (!email) {
                throw new AppError_1.default('email is required', 400);
            }
            const emailRegex = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailRegex.test(email)) {
                throw new AppError_1.default('Invalid email format', 400);
            }
            if (!password) {
                throw new AppError_1.default('password is required', 400);
            }
            const token = jsonwebtoken_1.default.sign({ email }, auth_1.default.jwt.secret, {
                expiresIn: auth_1.default.jwt.expiresIn,
            });
            return { token };
        });
    }
}
exports.default = LoginService;
