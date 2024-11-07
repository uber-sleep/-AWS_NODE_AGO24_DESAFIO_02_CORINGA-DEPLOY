"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
function yearValidator() {
    const currentYear = new Date().getFullYear();
    return { minYear: currentYear - 10, maxYear: currentYear + 1 };
}
function uniqueItems(value, helpers) {
    const uniqueValues = new Set(value);
    if (uniqueValues.size !== value.length) {
        return helpers.error('any.unique', { message: 'Items must be unique' });
    }
    return value;
}
const updateCarValidator = joi_1.default.object({
    plate: joi_1.default.string()
        .replace(/[\s-]/g, '')
        .uppercase()
        .length(7)
        .optional()
        .pattern(/^[A-Za-z]{3}[0-9]{1}[A-Za-z0-9]{1}[0-9]{2}$/)
        .messages({
        'string.base': 'Plate must be a string',
        'string.length': 'Plate must have exactly 7 characters',
        'string.pattern.base': 'The plate must be in the format: 3 letters, 1 number, 1 letter or number, and 2 numbers. [ABC1?23]',
    }),
    brand: joi_1.default.string().trim().min(2).max(45).optional().messages({
        'string.base': 'Brand must be a string',
        'string.min': 'Brand must have at least 2 characters',
        'string.max': 'Brand can only have 45 characters',
    }),
    model: joi_1.default.string().trim().min(2).max(90).optional().messages({
        'string.base': 'Model must be a string',
        'string.min': 'Model must have at least 2 characters',
        'string.max': 'Model can only have 90 characters',
    }),
    mileage: joi_1.default.number().integer().optional().messages({
        'number.base': 'Mileage must be a number',
        'number.integer': 'Mileage must be an integer',
    }),
    year: joi_1.default.number()
        .integer()
        .min(yearValidator().minYear)
        .max(yearValidator().maxYear)
        .optional()
        .messages({
        'number.base': 'Year must be a number',
        'number.integer': 'Year must be an integer',
        'number.min': `Year must be at least ${yearValidator().minYear}`,
        'number.max': `Year must not exceed ${yearValidator().maxYear}`,
    }),
    items: joi_1.default.array()
        .items(joi_1.default.string().trim().lowercase())
        .custom(uniqueItems)
        .min(1)
        .max(5)
        .optional()
        .messages({
        'array.base': 'Items must be an array',
        'array.min': 'Cars must have at least 1 item',
        'array.max': 'Cars can only have 5 items',
    }),
    daily_price: joi_1.default.number().optional().messages({
        'number.base': 'Daily price must be a number',
    }),
    status: joi_1.default.forbidden().messages({
        'object.unknown': 'Status cannot be updated',
    }),
});
exports.default = updateCarValidator;
