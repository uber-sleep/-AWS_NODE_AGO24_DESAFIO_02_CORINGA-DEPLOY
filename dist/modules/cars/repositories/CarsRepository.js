"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carsRepository = void 0;
const Cars_1 = __importDefault(require("../entities/Cars"));
const data_source_1 = __importDefault(require("../../../db/data-source"));
exports.carsRepository = data_source_1.default.getRepository(Cars_1.default);
