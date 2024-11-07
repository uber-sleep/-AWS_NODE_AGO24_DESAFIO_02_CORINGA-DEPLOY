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
class ListUsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    execute(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const [users, totalResults] = yield this.usersRepository.findAll(options);
            const totalPages = Math.ceil(totalResults / options.pagination.size);
            if (users.length === 0) {
                throw new AppError_1.default('', 204);
            }
            return {
                totalPages,
                currentPage: options.pagination.page,
                totalResults,
                pageResults: users.length,
                data: users,
            };
        });
    }
}
exports.default = ListUsersService;
