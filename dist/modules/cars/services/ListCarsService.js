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
const validators_1 = require("./validators");
const CarStatus_1 = __importDefault(require("../interface/CarStatus"));
class ListCarsService {
    constructor() {
        this.carsRepository = data_source_1.default.getRepository(Cars_1.default);
        this.listCars = (filters) => __awaiter(this, void 0, void 0, function* () {
            const queryBuilder = this.carsRepository.createQueryBuilder('car');
            const { error } = validators_1.listCarValidator.validate(filters);
            if (error) {
                throw new Error(error.message);
            }
            if (filters.status) {
                queryBuilder.andWhere('car.status = :status', { status: filters.status });
            }
            else {
                queryBuilder.andWhere('car.status != :status', {
                    status: CarStatus_1.default.Deleted,
                });
            }
            if (filters.plateEnd) {
                queryBuilder.andWhere('car.plate LIKE :plateEnd', {
                    plateEnd: `%${filters.plateEnd}`,
                });
            }
            if (filters.brand) {
                queryBuilder.andWhere('car.brand = :brand', { brand: filters.brand });
            }
            if (filters.model) {
                queryBuilder.andWhere('car.model = :model', { model: filters.model });
            }
            if (filters.mileage) {
                queryBuilder.andWhere('car.mileage <= :mileage', {
                    mileage: filters.mileage,
                });
            }
            if (filters.yearFrom) {
                queryBuilder.andWhere('car.year >= :yearFrom', {
                    yearFrom: filters.yearFrom,
                });
            }
            if (filters.yearTo) {
                queryBuilder.andWhere('car.year <= :yearTo', { yearTo: filters.yearTo });
            }
            if (filters.dailyPriceMin) {
                queryBuilder.andWhere('car.daily_price >= :dailyPriceMin', {
                    dailyPriceMin: filters.dailyPriceMin,
                });
            }
            if (filters.dailyPriceMax) {
                queryBuilder.andWhere('car.daily_price <= :dailyPriceMax', {
                    dailyPriceMax: filters.dailyPriceMax,
                });
            }
            if (filters.items) {
                queryBuilder.andWhere('car.items = :items', {
                    items: JSON.stringify(filters.items),
                });
            }
            if (filters.sortFields) {
                const sortFields = filters.sortFields.split(',');
                sortFields.forEach(field => {
                    const trimmedField = field.trim();
                    const order = filters.sortOrder === 'desc' ? 'DESC' : 'ASC';
                    queryBuilder.addOrderBy(`car.${trimmedField}`, order);
                });
            }
            else {
                queryBuilder.addOrderBy('car.daily_price', 'ASC');
            }
            const page = filters.page || 1;
            const limit = filters.limit || 10;
            queryBuilder.skip((page - 1) * limit).take(limit);
            queryBuilder.skip((page - 1) * limit).take(limit);
            const [cars, totalCount] = yield queryBuilder.getManyAndCount();
            return {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                cars: cars,
            };
        });
    }
}
exports.default = ListCarsService;
