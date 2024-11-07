"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPlate = formatPlate;
function formatPlate(plate) {
    return plate.trim().replace(/-/g, '').toUpperCase();
}
