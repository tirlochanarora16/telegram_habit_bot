"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStringArray = void 0;
const isStringArray = (value) => {
    return (Array.isArray(value) && value.every((item) => typeof item === "string"));
};
exports.isStringArray = isStringArray;
