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
exports.OrderController = void 0;
const data_source_1 = __importDefault(require("../../../db/data-source"));
const OrderEntity_1 = __importDefault(require("../entities/OrderEntity"));
const Customer_1 = __importDefault(require("../../customers/entities/Customer"));
const Cars_1 = __importDefault(require("../../cars/entities/Cars"));
const getCEP_1 = require("./getCEP");
const AppError_1 = __importDefault(require("../../../shared/errors/AppError"));
const checkUF_1 = __importDefault(require("./checkUF"));
const typeorm_1 = require("typeorm");
const date_fns_1 = require("date-fns");
const formatters_1 = require("../../cars/services/formatters");
class OrderController {
    constructor() {
        this.orderRepository = data_source_1.default.getRepository(OrderEntity_1.default);
        this.customerRepository = data_source_1.default.getRepository(Customer_1.default);
        this.carsRepository = data_source_1.default.getRepository(Cars_1.default);
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cpf_cliente, plate } = req.body;
                if (!cpf_cliente || !plate) {
                    throw new AppError_1.default("Customer CPF and car plate are required.", 400);
                }
                const formattedPlate = (0, formatters_1.formatPlate)(plate);
                const customer = yield this.customerRepository.findOne({
                    where: { cpf: cpf_cliente },
                });
                if (!customer) {
                    throw new AppError_1.default("Customer not found.", 404);
                }
                const car = yield this.carsRepository.findOne({ where: { plate: formattedPlate } });
                if (!car) {
                    throw new AppError_1.default("Car not found.", 404);
                }
                const existingOrder = yield this.orderRepository.findOne({
                    relations: ['customer'],
                    where: {
                        customer: { cpf: cpf_cliente },
                        statusRequest: (0, typeorm_1.In)(['open', 'approved']),
                    },
                });
                if (existingOrder) {
                    throw new AppError_1.default("Customer already has an open order.", 400);
                }
                const orderRequest = this.orderRepository.create({
                    customer,
                    car,
                    statusRequest: "open",
                });
                yield this.orderRepository.save(orderRequest);
                res.status(201).json({
                    status: 'success',
                    data: orderRequest,
                });
            }
            catch (error) {
                if (error instanceof AppError_1.default) {
                    res.status(error.statusCode).json({ status: 'error', message: error.message });
                }
                res.status(500).json({ status: 'error', message: `Internal Server Error. ${error}` });
            }
        });
    }
    showById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const rental = yield this.orderRepository
                    .createQueryBuilder('order')
                    .leftJoinAndSelect('order.customer', 'customer')
                    .leftJoinAndSelect('order.car', 'car')
                    .select([
                    'order.id',
                    'order.statusRequest',
                    'order.dateRequest',
                    'order.startDate',
                    'order.endDate',
                    'order.rentalTax',
                    'order.totalValue',
                    'order.cep',
                    'order.uf',
                    'order.city',
                    'customer.id',
                    'customer.fullName',
                    'customer.email',
                    'customer.cpf',
                    'car.id',
                    'car.brand',
                    'car.model',
                    'car.year',
                    'car.mileage',
                    'car.items',
                    'car.plate',
                    'car.daily_price',
                ])
                    .where('order.id = :id', { id })
                    .getOne();
                if (!rental) {
                    res.status(404).json({ status: 'error', message: "Order not found." });
                }
                res.status(200).json({
                    status: 'success',
                    data: rental,
                });
            }
            catch (error) {
                res.status(500).json({ status: 'error', message: `Internal Server Error. ${error}` });
            }
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, cpf, startDate, endDate } = req.query;
                const { page = '1', limit = '10', order = 'dateRequest', direction = 'DESC' } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (isNaN(pageNumber) || pageNumber < 1) {
                    throw new AppError_1.default("Invalid page number.", 400);
                }
                if (isNaN(limitNumber) || limitNumber < 1) {
                    throw new AppError_1.default("Invalid limit value.", 400);
                }
                const validOrderFields = ['dateRequest'];
                const validDirections = ['ASC', 'DESC'];
                const orderField = validOrderFields.includes(order) ? order : 'dateRequest';
                const orderDirection = validDirections.includes((direction === null || direction === void 0 ? void 0 : direction.toString().toUpperCase()) || 'DESC')
                    ? direction.toString().toUpperCase()
                    : 'DESC';
                const query = this.orderRepository
                    .createQueryBuilder('order')
                    .leftJoinAndSelect('order.customer', 'customer')
                    .select([
                    'order.id',
                    'order.statusRequest',
                    'order.dateRequest',
                    'order.startDate',
                    'order.endDate',
                    'order.rentalTax',
                    'order.totalValue',
                    'order.cep',
                    'order.uf',
                    'order.city',
                    'customer.id',
                    'customer.fullName',
                    'customer.cpf',
                ]);
                if (status) {
                    query.andWhere('order.statusRequest = :status', { status });
                }
                if (cpf) {
                    query.andWhere('customer.cpf = :cpf', { cpf });
                }
                if (startDate && endDate) {
                    query.andWhere('order.dateRequest BETWEEN :startDate AND :endDate', {
                        startDate,
                        endDate,
                    });
                }
                else if (startDate) {
                    query.andWhere('order.dateRequest >= :startDate', { startDate });
                }
                else if (endDate) {
                    query.andWhere('order.dateRequest <= :endDate', { endDate });
                }
                query.orderBy(`order.${orderField}`, orderDirection);
                const total = yield query.getCount();
                const rentals = yield query.skip((pageNumber - 1) * limitNumber).take(limitNumber).getMany();
                if (rentals.length === 0) {
                    res.status(200).json({
                        status: 'success',
                        message: "No orders found.",
                        data: [],
                        pagination: { total, page: pageNumber, lastPage: 0, limit: limitNumber },
                    });
                }
                rentals.forEach(rental => {
                    rental.rentalTax = Number(rental.rentalTax);
                    rental.totalValue = Number(rental.totalValue);
                });
                res.status(200).json({
                    status: 'success',
                    data: rentals,
                    pagination: {
                        total,
                        page: pageNumber,
                        lastPage: Math.ceil(total / limitNumber),
                        limit: limitNumber,
                    },
                });
            }
            catch (error) {
                res.status(500).json({ status: 'error', message: `Internal Server Error. ${error}` });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const order = yield this.orderRepository.findOne({
                    where: { id },
                    relations: ['car'],
                });
                if (!order) {
                    res.status(404).json({ message: "Order was not found" });
                    return;
                }
                const { cep, startDate, endDate, statusRequest } = req.body;
                const dateFormat = 'dd/MM/yyyy';
                if (startDate) {
                    const start = (0, date_fns_1.parse)(startDate, dateFormat, new Date());
                    if (isNaN(start.getTime())) {
                        res.status(400).json({ message: "Start date is invalid" });
                        return;
                    }
                    if ((0, date_fns_1.isBefore)(start, new Date())) {
                        res.status(400).json({ message: "Start date cannot be earlier than now" });
                        return;
                    }
                    order.startDate = start;
                }
                if (endDate) {
                    const end = (0, date_fns_1.parse)(endDate, dateFormat, new Date());
                    if (isNaN(end.getTime())) {
                        res.status(400).json({ message: "End date is invalid" });
                        return;
                    }
                    if ((0, date_fns_1.isBefore)(end, order.startDate || new Date())) {
                        res.status(400).json({ message: "End date should be later than start date" });
                    }
                    order.endDate = end;
                }
                if (cep) {
                    const cep_cliente = cep.toString().trim().replace('-', '');
                    if (cep_cliente.length !== 8) {
                        res.status(400).json({ message: "CEP must have 8 digits" });
                        return;
                    }
                    const data = yield (0, getCEP_1.getData)(cep_cliente);
                    if (!data) {
                        res.status(404).json({ message: "CEP was not found" });
                        return;
                    }
                    const uf = data.uf;
                    const rentalTax = (_a = checkUF_1.default[uf]) !== null && _a !== void 0 ? _a : 170.00;
                    order.cep = data.cep;
                    order.city = data.localidade;
                    order.uf = uf;
                    order.rentalTax = rentalTax;
                }
                if (statusRequest) {
                    const status = statusRequest.toLowerCase();
                    if (!['approved', 'closed', 'cancelled'].includes(status)) {
                        res.status(400).json({ message: "Status is not valid" });
                    }
                    if (status === 'approved') {
                        if (order.statusRequest !== 'open') {
                            res.status(400).json({ message: "Only open orders can be approved" });
                        }
                        if (!order.startDate ||
                            !order.endDate ||
                            !order.cep ||
                            !order.city ||
                            !order.uf ||
                            order.rentalTax === undefined) {
                            res.status(400).json({ message: "All values must be provided" });
                            return;
                        }
                        order.statusRequest = 'approved';
                    }
                    else if (status === 'cancelled') {
                        if (order.statusRequest !== 'open') {
                            res.status(400).json({ message: "Only open orders can be cancelled" });
                        }
                        order.statusRequest = 'cancelled';
                        order.cancelDate = new Date();
                    }
                    else if (status === 'closed') {
                        if (order.statusRequest !== 'approved') {
                            res.status(400).json({ message: "Only accepted orders can be closed" });
                        }
                        const today = new Date();
                        const end = order.endDate || today;
                        if ((0, date_fns_1.isBefore)(end, today)) {
                            const dayOver = (0, date_fns_1.differenceInDays)(today, end);
                            const dailyRate = Number(order.car.daily_price) || 0;
                            order.fine = dailyRate * 2 * dayOver;
                        }
                        order.statusRequest = 'closed';
                        order.finishDate = today;
                    }
                }
                if (order.startDate && order.endDate) {
                    const rentalDays = (0, date_fns_1.differenceInDays)(order.endDate, order.startDate) || 1;
                    const dailyRate = Number(order.car.daily_price) || 0;
                    const totalDailyRate = rentalDays * dailyRate;
                    order.totalValue =
                        totalDailyRate + (order.rentalTax || 0) + (order.fine || 0);
                }
                yield this.orderRepository.save(order);
                res.status(200).json({
                    status: 'success',
                    data: order,
                });
            }
            catch (error) {
                res.status(500).json({ status: 'error', message: `Internal Server Error. ${error}` });
            }
        });
    }
    cancelOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const order = yield this.orderRepository.findOne({
                    where: { id },
                    relations: ['customer', 'car'],
                });
                if (!order) {
                    throw new AppError_1.default("Order not found.", 404);
                }
                if (order.statusRequest !== 'open') {
                    throw new AppError_1.default("Only open orders can be cancelled.", 400);
                }
                order.statusRequest = 'cancelled';
                yield this.orderRepository.save(order);
                res.status(200).json({
                    status: 'success',
                    message: "Order cancelled successfully.",
                    data: order,
                });
            }
            catch (error) {
                if (error instanceof AppError_1.default) {
                    res.status(error.statusCode).json({ status: 'error', message: error.message });
                }
                else {
                    res.status(500).json({ status: 'error', message: `Internal Server Error. ${error}` });
                }
            }
        });
    }
}
exports.OrderController = OrderController;
