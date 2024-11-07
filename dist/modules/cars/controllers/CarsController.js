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
exports.CarsController = void 0;
const data_source_1 = __importDefault(require("../../../db/data-source"));
const Cars_1 = __importDefault(require("../entities/Cars"));
const validators_1 = require("../services/validators");
const joi_1 = __importDefault(require("joi"));
const AppError_1 = __importDefault(require("../../../shared/errors/AppError"));
class CarsController {
    constructor(createCarService, listCarsService, showCarService, updateCarService, deleteCarService) {
        this.createCarService = createCarService;
        this.listCarsService = listCarsService;
        this.showCarService = showCarService;
        this.updateCarService = updateCarService;
        this.deleteCarService = deleteCarService;
        this.carsRepository = data_source_1.default.getRepository(Cars_1.default);
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { error } = validators_1.createCarValidator.validate(req.body);
                if (error) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                const newCar = yield this.createCarService.createCar(req.body);
                res.status(201).json(newCar);
            }
            catch (error) {
                if (error instanceof AppError_1.default) {
                    res.status(error.statusCode).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id.trim();
                const car = yield this.showCarService.findCarById(id);
                res.status(200).json(car);
            }
            catch (error) {
                if (error instanceof AppError_1.default) {
                    res.status(error.statusCode).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.list = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.query;
                const carsResponse = yield this.listCarsService.listCars(filters);
                if (carsResponse && carsResponse.cars && carsResponse.cars.length > 0) {
                    carsResponse.cars.forEach(car => {
                        if (car.items) {
                            car.items = JSON.parse(car.items);
                        }
                    });
                }
                else {
                    throw new AppError_1.default('Car not found', 404);
                }
                res.status(200).json(carsResponse);
            }
            catch (error) {
                if (error instanceof joi_1.default.ValidationError) {
                    res.status(400).json({ message: error.message });
                }
                else if (error instanceof AppError_1.default) {
                    res.status(error.statusCode).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        });
        this.updateCar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id.trim();
                const updates = req.body;
                if (updates.status !== undefined) {
                    res.status(400).json({ message: 'The status field cannot be updated' });
                    return;
                }
                const { error } = validators_1.updateCarValidator.validate(updates);
                if (error) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                const updatedCar = yield this.updateCarService.updateCar(id, updates);
                res.status(201).json(updatedCar);
            }
            catch (error) {
                if (error instanceof AppError_1.default) {
                    res.status(error.statusCode).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.deleteCar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id.trim();
            try {
                yield this.deleteCarService.deleteCar(id);
                res.status(200).json({ message: 'Car deleted successfully' });
            }
            catch (error) {
                if (error instanceof AppError_1.default) {
                    res.status(error.statusCode).json({ message: error.message });
                    return;
                }
                console.log(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.CarsController = CarsController;
