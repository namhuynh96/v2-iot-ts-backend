"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
const jwks_1 = __importDefault(require("../config/jwks"));
const keys_1 = __importDefault(require("../config/keys"));
const admin_1 = __importDefault(require("../models/admin"));
const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
        const jwk = jwks_1.default.find(jwk => jwk.kid === decoded.header.kid);
        const pem = jwk_to_pem_1.default({ kty: "RSA", n: jwk.n, e: jwk.e });
        jsonwebtoken_1.default.verify(token, pem, { algorithms: ["RS256"] }, async (err, decodedToken) => {
            if (err) {
                throw new Error();
            }
            const { exp, aud, iss, token_use, email } = decodedToken;
            if (exp * 1000 > Date.now() &&
                aud === keys_1.default.webClientId &&
                iss === keys_1.default.userPoolIssuer &&
                token_use === "id") {
                const cognitoUsernameDecoded = decodedToken;
                const user = {
                    cognitoUsername: cognitoUsernameDecoded["cognito:username"],
                    email
                };
                try {
                    const admin = await admin_1.default.findOne({
                        cognitoUsername: user.cognitoUsername
                    });
                    if (!admin) {
                        throw new Error();
                    }
                    next();
                }
                catch (_a) {
                    return res.status(401).send();
                }
            }
        });
    }
    catch (e) {
        res.status(401).send({ error: "Admin authorization is not valid" });
    }
};
exports.default = auth;
