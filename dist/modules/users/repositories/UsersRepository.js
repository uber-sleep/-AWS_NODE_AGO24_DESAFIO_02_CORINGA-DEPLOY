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
Object.defineProperty(exports, "__esModule", { value: true });
class UsersRepository {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersRepository.save(user);
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this.usersRepository.create(user);
            yield this.usersRepository.save(newUser);
            return newUser.id;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findOne({
                where: { email },
            });
            return user || null;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findOne({
                where: { id },
            });
            return user || null;
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findOne({
                where: { name },
            });
            return user || null;
        });
    }
    findAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filters, sort, pagination } = options;
            const queryBuilder = this.usersRepository.createQueryBuilder('user');
            if (filters.name) {
                queryBuilder.andWhere('user.name LIKE : name', {
                    name: `%${filters.name.trim()}%`,
                });
            }
            if (filters.email) {
                queryBuilder.andWhere('user.email LIKE : email', {
                    email: `%${filters.email.trim()}%`,
                });
            }
            if (filters.isDeleted !== undefined) {
                queryBuilder.andWhere('user.deletedAt IS' + (filters.isDeleted ? 'NOT NULL' : 'NULL'));
            }
            if (sort && sort.field && sort.order) {
                queryBuilder.orderBy(`user.${sort.field}`, sort.order);
            }
            queryBuilder
                .skip((pagination.page - 1) * pagination.size)
                .take(pagination.size);
            const [users, count] = yield queryBuilder.getManyAndCount();
            return [users, count];
        });
    }
    update(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersRepository.update(id, user);
            if (result.affected === 0) {
                return null;
            }
            return yield this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            yield this.usersRepository.softRemove(user);
        });
    }
}
exports.default = UsersRepository;
