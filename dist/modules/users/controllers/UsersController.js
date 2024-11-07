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
Object.defineProperty(exports, "__esModule", { value: true });
class UsersController {
    constructor(createUserService, listUsersService, showUserService, deleteUserService, updateUserService) {
        this.createUserService = createUserService;
        this.listUsersService = listUsersService;
        this.showUserService = showUserService;
        this.deleteUserService = deleteUserService;
        this.updateUserService = updateUserService;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            const id = yield this.createUserService.execute(user);
            res.status(201).json({ id });
        });
    }
    listUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filters = req.query.filters || {};
            const sort = req.query.sort || {
                field: 'createdAt',
                order: 'ASC',
            };
            const paginationQuery = req.query.pagination;
            const pagination = {
                page: parseInt((paginationQuery === null || paginationQuery === void 0 ? void 0 : paginationQuery.page) || '1', 10),
                size: parseInt((paginationQuery === null || paginationQuery === void 0 ? void 0 : paginationQuery.size) || '10', 10),
            };
            const users = yield this.listUsersService.execute({
                filters,
                sort,
                pagination,
            });
            res.status(200).json(users);
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield this.showUserService.execute(id);
            res.status(200).json({ user });
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield this.deleteUserService.execute(id);
            res.status(200).json({});
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, email, password } = req.body;
            const user = yield this.updateUserService.execute({
                id,
                name,
                email,
                password,
            });
            res.status(200).json({ user });
        });
    }
}
exports.default = UsersController;
