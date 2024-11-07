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
const typeorm_1 = require("typeorm");
const CustomerRepository_1 = require("../repositories/CustomerRepository");
class ReadCustomerServices {
    listCustomers(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, cpf, exclude, orderBy, orderDirection = 'DESC', page = 1, limit = 10, } = queryParams;
            const condition = {};
            if (name) {
                condition.fullName = (0, typeorm_1.Like)(`%${name}%`);
            }
            if (email) {
                condition.email = (0, typeorm_1.Like)(`%${email}%`);
            }
            if (cpf) {
                condition.cpf = cpf;
            }
            if (exclude === true) {
                condition.deletedAt = (0, typeorm_1.Not)((0, typeorm_1.IsNull)());
            }
            else if (exclude === false) {
                condition.deletedAt = (0, typeorm_1.IsNull)();
            }
            const order = {};
            const validOrderFields = [
                'fullName',
                'createdAt',
                'deletedAt',
            ];
            if (orderBy && validOrderFields.includes(orderBy)) {
                order[orderBy] =
                    orderDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
            }
            const [customers, total] = yield CustomerRepository_1.customerRepositorySource.findAndCount({
                where: condition,
                order,
                withDeleted: true,
                take: Number(limit),
                skip: (Number(page) - 1) * Number(limit),
            });
            const totalPages = Math.ceil(total / Number(limit));
            return {
                total,
                page: Number(page),
                totalPages,
                customers,
            };
        });
    }
}
exports.default = new ReadCustomerServices();
