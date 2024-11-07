"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsersRepository_1 = __importDefault(require("../repositories/UsersRepository"));
const BcryptHashProvider_1 = __importDefault(require("../providers/BcryptHashProvider"));
const CreateUserService_1 = __importDefault(require("../services/CreateUserService"));
const UsersController_1 = __importDefault(require("../controllers/UsersController"));
const User_1 = __importDefault(require("../entities/User"));
const celebrate_1 = require("celebrate");
const data_source_1 = __importDefault(require("../../../db/data-source"));
const ListUsersService_1 = __importDefault(require("../services/ListUsersService"));
const DeleteUserService_1 = __importDefault(require("../services/DeleteUserService"));
const ShowUserService_1 = __importDefault(require("../services/ShowUserService"));
const UpdateUserService_1 = __importDefault(require("../services/UpdateUserService"));
const userRouter = (0, express_1.Router)();
const userRepository = data_source_1.default.getRepository(User_1.default);
const usersRepository = new UsersRepository_1.default(userRepository);
const hashProvider = new BcryptHashProvider_1.default();
const createUserService = new CreateUserService_1.default(usersRepository, hashProvider);
const listUsersService = new ListUsersService_1.default(usersRepository);
const showUserService = new ShowUserService_1.default(usersRepository);
const deleteUserService = new DeleteUserService_1.default(usersRepository);
const updateUserService = new UpdateUserService_1.default(usersRepository, hashProvider);
const usersController = new UsersController_1.default(createUserService, listUsersService, showUserService, deleteUserService, updateUserService);
userRouter.get('/', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.QUERY]: {
        filters: celebrate_1.Joi.object({
            name: celebrate_1.Joi.string().optional(),
            email: celebrate_1.Joi.string().optional(),
            isDeleted: celebrate_1.Joi.boolean().optional(),
        }).optional(),
        sort: celebrate_1.Joi.object({
            field: celebrate_1.Joi.string()
                .valid('name', 'email', 'createdAt')
                .default('createdAt'),
            order: celebrate_1.Joi.string().valid('ASC', 'DESC').default('ASC'),
        }).optional(),
        pagination: celebrate_1.Joi.object({
            page: celebrate_1.Joi.number().integer().min(1).default(1),
            size: celebrate_1.Joi.number().integer().min(1).default(10),
        }).optional(),
    },
}), (req, res) => usersController.listUsers(req, res));
userRouter.get('/:id', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: {
        id: celebrate_1.Joi.string().uuid().required(),
    },
}), (req, res) => usersController.show(req, res));
userRouter.post('/', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: {
        name: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().min(8).required(),
    },
}), (req, res) => usersController.create(req, res));
userRouter.patch('/:id', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: {
        id: celebrate_1.Joi.string().uuid().required(),
    },
    [celebrate_1.Segments.BODY]: {
        name: celebrate_1.Joi.string().optional(),
        email: celebrate_1.Joi.string().email().optional(),
        password: celebrate_1.Joi.string().min(8).optional(),
    },
}), (req, res) => usersController.update(req, res));
userRouter.delete('/:id', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: {
        id: celebrate_1.Joi.string().uuid().required(),
    },
}), (req, res) => usersController.remove(req, res));
exports.default = userRouter;
