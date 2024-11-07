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
const formatters_1 = require("./formatters");
const AppError_1 = __importDefault(require("../../../shared/errors/AppError"));
class UpdateCarService {
    constructor() {
        this.updateCar = (id, updates) => __awaiter(this, void 0, void 0, function* () {
            const carsRepository = data_source_1.default.getRepository(Cars_1.default);
            const car = yield carsRepository.findOneBy({ id });
            if (!car) {
                throw new AppError_1.default('Car not found', 404);
            }
            const updateFields = [
                'plate',
                'brand',
                'model',
                'mileage',
                'year',
                'items',
                'daily_price',
            ];
            for (let i = 0; i < updateFields.length; i++) {
                const field = updateFields[i];
                if (updates[field] !== undefined) {
                    if (field === 'plate') {
                        car.plate = (0, formatters_1.formatPlate)(updates.plate);
                    }
                    else if (field === 'mileage' ||
                        field === 'year' ||
                        field === 'daily_price') {
                        car[field] = updates[field];
                    }
                    else if (field === 'items') {
                        car.items = JSON.stringify(updates.items).trim().toLowerCase();
                    }
                    else {
                        car[field] = updates[field].trim();
                    }
                }
            }
            yield carsRepository.save(car);
            return car;
        });
    }
}
exports.default = UpdateCarService;
