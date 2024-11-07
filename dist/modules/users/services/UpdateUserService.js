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
class UpdateUserService {
    constructor(usersRepository, hashProvider) {
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, name, email, password }) {
            if (!id) {
                throw new AppError_1.default('user id is required', 400);
            }
            const user = yield this.usersRepository.findById(id);
            if (!user) {
                throw new AppError_1.default('user not found', 404);
            }
            if (name) {
                if (name.split(' ').length < 2) {
                    throw new AppError_1.default('name and surname is required', 400);
                }
                user.name = name;
            }
            if (email) {
                const emailRegex = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/;
                if (!emailRegex.test(email)) {
                    throw new AppError_1.default('email format is invalid', 400);
                }
                const emailDuplicate = yield this.usersRepository.findByEmail(email);
                if (emailDuplicate) {
                    throw new AppError_1.default('a user with this email address already exists', 409);
                }
                user.email = email;
            }
            if (password) {
                user.password = yield this.hashProvider.generateHash(password);
            }
            const updatedUser = yield this.usersRepository.update(id, user);
            if (!updatedUser) {
                throw new AppError_1.default('could not update user', 500);
            }
            return updatedUser;
        });
    }
}
exports.default = UpdateUserService;
