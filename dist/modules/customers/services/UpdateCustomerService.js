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
const CustomerRepository_1 = __importDefault(require("../repositories/CustomerRepository"));
const validator_1 = __importDefault(require("validator"));
const AppError_1 = __importDefault(require("../../../shared/errors/AppError"));
const customerClassRepository = new CustomerRepository_1.default();
function isValidPhone(phone) {
    return validator_1.default.isMobilePhone(phone, ['pt-BR']);
}
function isValidDate(birthDate) {
    return validator_1.default.isDate(birthDate, { format: 'DD/MM/YYYY' });
}
const isValidCpf = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11)
        return false;
    if (/^(\d)\1{10}$/.test(cpf))
        return false;
    const calculateDigit = (digits) => {
        let sum = 0;
        for (let i = 0; i < digits.length; i++) {
            sum += parseInt(digits[i]) * (digits.length + 1 - i);
        }
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };
    const firstDigit = calculateDigit(cpf.substring(0, 9));
    if (firstDigit !== parseInt(cpf[9]))
        return false;
    const secondDigit = calculateDigit(cpf.substring(0, 10));
    if (secondDigit !== parseInt(cpf[10]))
        return false;
    return true;
};
class UpdateCustomerService {
    validateCustomerUpdate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullName, birthDate, cpf, email, phone } = req.body;
            if (fullName && (typeof fullName !== 'string' || fullName.length < 3)) {
                throw new AppError_1.default('Name must be letters and must be more than 3 letters', 400);
            }
            if (birthDate) {
                if (!isValidDate(birthDate)) {
                    throw new AppError_1.default('Send a valid date', 400);
                }
                const [day, month, year] = birthDate.split('/');
                req.body.birthDate = new Date(`${year}-${month}-${day}`);
            }
            if (email) {
                if (!validator_1.default.isEmail(email)) {
                    throw new AppError_1.default('Send a valid email', 400);
                }
                const customerExistsEmail = yield customerClassRepository.findCustomerByEmail(email);
                if (customerExistsEmail) {
                    throw new AppError_1.default('A customer with this email already exists', 400);
                }
            }
            if (phone) {
                if (!isValidPhone(phone)) {
                    throw new AppError_1.default('Send a valid phone number', 400);
                }
            }
            if (cpf) {
                if (!isValidCpf(cpf)) {
                    throw new AppError_1.default('Send a valid CPF', 400);
                }
                const customerExistsCpf = yield customerClassRepository.findCustomerByCpf(cpf);
                if (customerExistsCpf) {
                    throw new AppError_1.default('A customer with this CPF already exists', 400);
                }
            }
            next();
        });
    }
}
exports.default = UpdateCustomerService;
