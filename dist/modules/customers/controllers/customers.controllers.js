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
const uuid_1 = require("uuid");
const CustomerRepository_1 = require("../repositories/CustomerRepository");
const ReadCustomerService_1 = __importDefault(require("../services/ReadCustomerService"));
const AppError_1 = __importDefault(require("../../../shared/errors/AppError"));
class CustomerController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = req.body;
            try {
                const newCustomer = CustomerRepository_1.customerRepositorySource.create(customer);
                yield CustomerRepository_1.customerRepositorySource.save(newCustomer);
                res.status(201).json({ newCustomer });
                return;
            }
            catch (error) {
                res.status(500).json({ message: 'Internal Server Error', error });
                return;
            }
        });
    }
    readById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const customer = yield CustomerRepository_1.customerRepositorySource.findOneBy({ id });
                if (!id || !(0, uuid_1.validate)(id)) {
                    res.status(400).json({ message: 'Valid ID is required' });
                    return;
                }
                if (!customer) {
                    res.status(404).json({ message: 'Customer not found' });
                    return;
                }
                res.status(200).json({ customer });
                return;
            }
            catch (error) {
                res.status(500).json({ message: 'Internal Server Error', error });
                return;
            }
        });
    }
    read(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryParams = req.query;
            try {
                const result = yield ReadCustomerService_1.default.listCustomers(queryParams);
                if (result.customers.length === 0) {
                    res.status(404).json({ message: 'No customers found' });
                    return;
                }
                res.status(200).json(result);
                return;
            }
            catch (error) {
                res.status(500).json({ message: 'Internal Server Error', error });
                return;
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const customer = yield CustomerRepository_1.customerRepositorySource.findOne({
                where: { id },
                withDeleted: true,
            });
            yield CustomerRepository_1.customerRepositorySource.softDelete({ id });
            if (!id || !(0, uuid_1.validate)(id)) {
                throw new AppError_1.default('Valid ID is required', 400);
            }
            if (!customer) {
                throw new AppError_1.default('Customer not found', 400);
            }
            if (customer.deletedAt) {
                throw new AppError_1.default('Customer already deleted', 400);
            }
            res.status(200).json({ message: 'Customer deleted' });
            return;
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const customerData = req.body;
            try {
                const existsCustomer = yield CustomerRepository_1.customerRepositorySource.findOne({
                    where: { id },
                });
                if (!existsCustomer) {
                    throw new AppError_1.default('Customer not found', 404);
                }
                yield CustomerRepository_1.customerRepositorySource.update({ id }, customerData);
                res.status(200).json({ message: 'Customer updated' });
                return;
            }
            catch (error) {
                if (error instanceof AppError_1.default) {
                    res.status(error.statusCode).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.default = CustomerController;
