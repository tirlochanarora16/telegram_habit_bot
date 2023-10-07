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
exports.redis = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ioredis_1 = require("ioredis");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield mongoose_1.default.connect((_a = process.env.MONGO_URL) !== null && _a !== void 0 ? _a : "");
        return true;
    }
    catch (err) {
        console.warn(`Error connecting to the database: ${err}`);
        return false;
    }
});
exports.redis = new ioredis_1.Redis({
    host: "localhost",
    port: 6379,
});
exports.default = connectDB;
