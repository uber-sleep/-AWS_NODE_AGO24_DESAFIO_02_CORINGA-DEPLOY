"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const CarStatus_1 = __importDefault(require("../interface/CarStatus"));
const OrderEntity_1 = __importDefault(require("../../orders/entities/OrderEntity"));
let Cars = class Cars {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Cars.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 7, nullable: false }),
    __metadata("design:type", String)
], Cars.prototype, "plate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 45, nullable: false }),
    __metadata("design:type", String)
], Cars.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 90, nullable: false }),
    __metadata("design:type", String)
], Cars.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true, default: 0 }),
    __metadata("design:type", Number)
], Cars.prototype, "mileage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cars.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Cars.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Cars.prototype, "daily_price", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: ['active', 'inactive', 'deleted'],
        nullable: false,
    }),
    __metadata("design:type", String)
], Cars.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => OrderEntity_1.default, order => order.car),
    __metadata("design:type", OrderEntity_1.default)
], Cars.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { nullable: false, default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Cars.prototype, "registration_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'datetime',
        nullable: true,
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Cars.prototype, "updated_time", void 0);
Cars = __decorate([
    (0, typeorm_1.Entity)('cars')
], Cars);
exports.default = Cars;
