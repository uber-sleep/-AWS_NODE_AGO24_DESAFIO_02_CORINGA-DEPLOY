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
const CarStatus_1 = __importDefault(require("../interface/CarStatus"));
const AppError_1 = __importDefault(require("../../../shared/errors/AppError"));
class CreateCarService {
    constructor() {
        this.createCar = (carData) => __awaiter(this, void 0, void 0, function* () {
            const carsRepository = data_source_1.default.getRepository(Cars_1.default);
            const { plate, brand, model, mileage, year, items, daily_price, status } = carData;
            const formattedPlate = (0, formatters_1.formatPlate)(plate);
            const itemsString = JSON.stringify(items);
            const newCar = new Cars_1.default();
            newCar.plate = formattedPlate;
            newCar.brand = brand.trim();
            newCar.model = model.trim();
            newCar.mileage = mileage !== null && mileage !== void 0 ? mileage : null;
            newCar.year = year;
            newCar.items = itemsString.trim().toLowerCase();
            newCar.daily_price = daily_price;
            newCar.status = status;
            const existingCar = yield carsRepository.findOne({
                where: { plate: formattedPlate },
            });
            if (existingCar && existingCar.status !== CarStatus_1.default.Deleted) {
                throw new AppError_1.default('This car is already registrated!', 409);
            }
            yield carsRepository.save(newCar);
            return newCar;
        });
    }
}
exports.default = CreateCarService;
