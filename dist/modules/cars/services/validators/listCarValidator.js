"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const listCarValidator = joi_1.default.object({
    status: joi_1.default.string().valid('active', 'inactive').optional().messages({
        'any.only': 'Status must be active or inactive',
    }),
    plateEnd: joi_1.default.string().optional().trim().messages({
        'string.base': 'Plate end must be a string',
    }),
    brand: joi_1.default.string().optional().trim().messages({
        'string.base': 'Brand must be a string',
    }),
    model: joi_1.default.string().optional().trim().messages({
        'string.base': 'Model must be a string',
    }),
    items: joi_1.default.array().items(joi_1.default.string().trim()).max(5).optional().messages({
        'array.max': 'Cannot have more than 5 items',
    }),
    mileage: joi_1.default.number().min(0).optional().messages({
        'number.base': 'Mileage must be a number',
        'number.min': 'Mileage cannot be negative',
    }),
    yearFrom: joi_1.default.number().optional().messages({
        'number.base': 'Year must be a number',
    }),
    yearTo: joi_1.default.number().min(joi_1.default.ref('yearFrom')).optional().messages({
        'number.base': 'Year must be a number',
        'number.min': 'Year must be greater than or equal to the starting year',
    }),
    dailyPriceMin: joi_1.default.number().min(0).optional().messages({
        'number.base': 'Minimum daily price must be a number',
        'number.min': 'Minimum daily price cannot be negative',
    }),
    dailyPriceMax: joi_1.default.number()
        .min(joi_1.default.ref('dailyPriceMin'))
        .optional()
        .messages({
        'number.base': 'Maximum daily price must be a number',
        'number.min': 'Maximum daily price must be greater than or equal to the minimum price',
    }),
    sortFields: joi_1.default.string().optional().trim().messages({
        'string.base': 'Sort fields must be a string',
    }),
    sortOrder: joi_1.default.string().valid('asc', 'desc').optional().messages({
        'any.only': 'Order must be "asc" or "desc"',
    }),
    page: joi_1.default.number().min(1).optional().messages({
        'number.base': 'Page number must be a number',
        'number.min': 'Page number must be at least 1',
    }),
    size: joi_1.default.number().min(1).messages({
        'number.base': 'Size must be a number',
        'number.min': 'Size must be at least 1',
    }),
});
exports.default = listCarValidator;
