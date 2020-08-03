"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    cognitoUsername: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
});
const Admin = mongoose_1.model("Admin", adminSchema);
exports.default = Admin;
