"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./db/mongoose");
const admin_1 = __importDefault(require("./routers/admin"));
const user_1 = __importDefault(require("./routers/user"));
const building_1 = __importDefault(require("./routers/building"));
const room_1 = __importDefault(require("./routers/room"));
const device_1 = __importDefault(require("./routers/device"));
const checkConnected_1 = __importDefault(require("./aws/checkConnected"));
const path_1 = __importDefault(require("path"));
checkConnected_1.default();
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join("public")));
app.use(admin_1.default);
app.use(user_1.default);
app.use(building_1.default);
app.use(room_1.default);
app.use(device_1.default);
app.use((_req, res, _next) => {
    res.sendFile(path_1.default.resolve(__dirname, "public", "index.html"));
});
exports.default = app;
