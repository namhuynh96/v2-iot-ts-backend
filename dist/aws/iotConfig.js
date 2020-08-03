"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.apiVersion = "2015-05-28";
const iot = new aws_sdk_1.default.Iot({ region: "eu-central-1" });
exports.default = iot;
