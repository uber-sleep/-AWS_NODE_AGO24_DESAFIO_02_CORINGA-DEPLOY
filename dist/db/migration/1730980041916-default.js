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
exports.Default1730980041916 = void 0;
class Default1730980041916 {
    constructor() {
        this.name = 'Default1730980041916';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`cars\` (\`id\` varchar(36) NOT NULL, \`plate\` varchar(7) NOT NULL, \`brand\` varchar(45) NOT NULL, \`model\` varchar(90) NOT NULL, \`mileage\` int UNSIGNED NOT NULL DEFAULT '0', \`year\` int NOT NULL, \`items\` varchar(255) NOT NULL, \`daily_price\` decimal(10,2) NOT NULL, \`status\` enum ('active', 'inactive', 'deleted') NOT NULL, \`registration_date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_time\` datetime NULL ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`Order\` (\`id\` varchar(36) NOT NULL, \`dateRequest\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`statusRequest\` enum ('open', 'approved', 'closed', 'cancelled') NOT NULL, \`cep\` varchar(255) NULL, \`city\` varchar(255) NULL, \`uf\` varchar(255) NULL, \`rentalTax\` decimal(10,2) NOT NULL DEFAULT '0.00', \`totalValue\` decimal(10,2) NOT NULL DEFAULT '0.00',
\`startDate\` timestamp NULL, \`endDate\` timestamp NULL, \`cancelDate\` timestamp NULL, \`finishDate\` timestamp NULL DEFAULT CURRENT_TIMESTAMP, \`fine\` decimal NOT NULL DEFAULT '0', \`customerId\` varchar(36) NOT NULL, \`carId\` varchar(36) NOT NULL, UNIQUE INDEX \`REL_0f88449168b8ffae36cb3f8a14\` (\`customerId\`), UNIQUE INDEX \`REL_4e45520de94d82e3dce3b5d561\` (\`carId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`customers\` (\`id\` varchar(36) NOT NULL, \`fullName\` varchar(100) NOT NULL, \`birthDate\` date NOT NULL, \`cpf\` varchar(14) NOT NULL, \`email\` varchar(100)
NOT NULL, \`phone\` varchar(20) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`Order\` ADD CONSTRAINT \`FK_0f88449168b8ffae36cb3f8a140\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Order\` ADD CONSTRAINT \`FK_4e45520de94d82e3dce3b5d5614\` FOREIGN KEY (\`carId\`) REFERENCES \`cars\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`Order\` DROP FOREIGN KEY \`FK_4e45520de94d82e3dce3b5d5614\``);
            yield queryRunner.query(`ALTER TABLE \`Order\` DROP FOREIGN KEY \`FK_0f88449168b8ffae36cb3f8a140\``);
            yield queryRunner.query(`DROP TABLE \`users\``);
            yield queryRunner.query(`DROP TABLE \`customers\``);
            yield queryRunner.query(`DROP INDEX \`REL_4e45520de94d82e3dce3b5d561\` ON \`Order\``);
            yield queryRunner.query(`DROP INDEX \`REL_0f88449168b8ffae36cb3f8a14\` ON \`Order\``);
            yield queryRunner.query(`DROP TABLE \`Order\``);
            yield queryRunner.query(`DROP TABLE \`cars\``);
        });
    }
}
exports.Default1730980041916 = Default1730980041916;
