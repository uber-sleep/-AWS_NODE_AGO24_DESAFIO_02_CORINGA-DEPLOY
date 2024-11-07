"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CarsController_1 = require("../controllers/CarsController");
const services_1 = __importDefault(require("../services"));
const carRoutes = (0, express_1.Router)();
const carsController = new CarsController_1.CarsController(new services_1.default.CreateCarService(), new services_1.default.ListCarsService(), new services_1.default.ShowCarService(), new services_1.default.UpdateCarService(), new services_1.default.DeleteCarService());
carRoutes.post('/', carsController.create);
carRoutes.get('/:id', carsController.getById.bind(carsController));
carRoutes.get('/', carsController.list);
carRoutes.patch('/:id', carsController.updateCar);
carRoutes.delete('/:id', carsController.deleteCar);
exports.default = carRoutes;
