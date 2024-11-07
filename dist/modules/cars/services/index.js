"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CreateCarService_1 = __importDefault(require("./CreateCarService"));
const ShowCarService_1 = __importDefault(require("./ShowCarService"));
const ListCarsService_1 = __importDefault(require("./ListCarsService"));
const UpdateCarService_1 = __importDefault(require("./UpdateCarService"));
const DeleteCarService_1 = __importDefault(require("./DeleteCarService"));
exports.default = {
    CreateCarService: CreateCarService_1.default,
    ShowCarService: ShowCarService_1.default,
    ListCarsService: ListCarsService_1.default,
    UpdateCarService: UpdateCarService_1.default,
    DeleteCarService: DeleteCarService_1.default,
};
