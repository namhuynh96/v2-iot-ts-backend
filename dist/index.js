"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hamkIotApp_1 = __importDefault(require("./hamkIotApp"));
const port = 10002;
hamkIotApp_1.default.listen(port, () => {
    console.log("Server is up on port " + port);
});
