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
exports.getData = void 0;
const AppError_1 = __importDefault(require("../../../shared/errors/AppError"));
const getData = (cep) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://viacep.com.br/ws/${cep}/json/`);
    let data = yield response.json();
    if (!data) {
        throw new AppError_1.default('CEP Not found', 400);
    }
    return (data = {
        uf: data.uf,
        localidade: data.localidade,
        cep: data.cep,
    });
});
exports.getData = getData;
