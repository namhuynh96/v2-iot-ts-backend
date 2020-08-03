"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userShema = new mongoose_1.Schema({
    cognitoUsername: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    isRequesting: {
        type: Boolean,
        default: false
    },
    cognitoIdentityId: {
        type: String
    }
});
const User = mongoose_1.model("User", userShema);
exports.default = User;
