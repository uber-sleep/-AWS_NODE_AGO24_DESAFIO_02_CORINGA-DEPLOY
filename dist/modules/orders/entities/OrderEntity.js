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
const Customer_1 = __importDefault(require("../../customers/entities/Customer"));
const Cars_1 = __importDefault(require("../../cars/entities/Cars"));
let Order = class Order {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Order.prototype, "dateRequest", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', {
        enum: ['open', 'approved', 'closed', 'cancelled']
    }),
    __metadata("design:type", String)
], Order.prototype, "statusRequest", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: null }),
    __metadata("design:type", String)
], Order.prototype, "cep", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: null }),
    __metadata("design:type", String)
], Order.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: null }),
    __metadata("design:type", String)
], Order.prototype, "uf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "rentalTax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "totalValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "cancelDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "finishDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "fine", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Customer_1.default, customer => customer.order, { nullable: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Customer_1.default)
], Order.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Cars_1.default, cars => cars.order, { nullable: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Cars_1.default)
], Order.prototype, "car", void 0);
Order = __decorate([
    (0, typeorm_1.Entity)('Order')
], Order);
exports.default = Order;
