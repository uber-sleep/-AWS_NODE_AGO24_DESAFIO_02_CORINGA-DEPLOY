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
const AppError_1 = __importDefault(require("../../../shared/errors/AppError"));
class ShowCarService {
    constructor() {
        this.findCarById = (id) => __awaiter(this, void 0, void 0, function* () {
            const carsRepository = data_source_1.default.getRepository(Cars_1.default);
            const car = yield carsRepository.findOneBy({ id });
            if (!car) {
                throw new AppError_1.default('Car not found', 404);
            }
            car.items = JSON.parse(car.items);
            car.items = Array.isArray(car.items) ? car.items.join(', ') : '';
            return car;
        });
    }
}
exports.default = ShowCarService;
