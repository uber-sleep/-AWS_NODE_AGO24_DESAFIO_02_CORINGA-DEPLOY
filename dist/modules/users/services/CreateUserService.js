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
class CreateUser {
    constructor(usersRepository, hashProvider) {
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, password }) {
            if (!name) {
                throw new AppError_1.default('full name is required', 400);
            }
            if (name.split(' ').length < 2) {
                throw new AppError_1.default('name and surname is required', 400);
            }
            if (!email) {
                throw new AppError_1.default('email is required', 400);
            }
            const emailRegex = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailRegex.test(email)) {
                throw new AppError_1.default('email format is invalid', 400);
            }
            const emailDuplicate = yield this.usersRepository.findByEmail(email);
            if (emailDuplicate) {
                throw new AppError_1.default('a user with this email address already exists', 409);
            }
            if (!password) {
                throw new AppError_1.default('password is required', 400);
            }
            const hashedPassword = yield this.hashProvider.generateHash(password);
            const userId = yield this.usersRepository.create({
                name,
                email,
                password: hashedPassword,
            });
            if (!userId) {
                throw new AppError_1.default('failed to create user', 500);
            }
            return userId;
        });
    }
}
exports.default = CreateUser;
