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
const Cars_1 = __importDefault(require("../entities/Cars"));
const data_source_1 = __importDefault(require("../../../db/data-source"));
const CarStatus_1 = __importDefault(require("../interface/CarStatus"));
const OrderEntity_1 = __importDefault(require("../../orders/entities/OrderEntity"));
const AppError_1 = __importDefault(require("../../../shared/errors/AppError"));
class DeleteCarService {
    constructor() {
        this.deleteCar = (id) => __awaiter(this, void 0, void 0, function* () {
            const carsRepository = data_source_1.default.getRepository(Cars_1.default);
            const orderRepository = data_source_1.default.getRepository(OrderEntity_1.default);
            const car = yield carsRepository.findOneBy({ id });
            if (!car) {
                throw new AppError_1.default('Car not found!', 404);
            }
            if (car.status == CarStatus_1.default.Deleted) {
                throw new AppError_1.default('This car is already deleted!', 409);
            }
            const order = yield orderRepository.findOne({
                where: { id },
                select: ['statusRequest'],
            });
            if (order) {
                const statusRequest = order.statusRequest;
                if (statusRequest !== 'cancelled' && statusRequest !== 'closed') {
                    throw new AppError_1.default("This car can't be deleted due to outstanding issues or open orders", 409);
                }
            }
            car.status = CarStatus_1.default.Deleted;
            yield carsRepository.save(car);
        });
    }
}
exports.default = DeleteCarService;
